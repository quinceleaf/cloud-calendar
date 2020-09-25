import base64
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    client = boto3.resource("dynamodb")
    table = client.Table("Events")

    response = {
        "isBase64Encoded": "false",
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
    }
    return_body = {}

    prior_cursor = False
    page_size = 10
    page_direction = True
    is_tag_query = False

    if event.get("queryStringParameters", False):
        prior_cursor = event["queryStringParameters"].get("cursor", None)
        if prior_cursor:
            prior_key = decode_cursor(prior_cursor)
        print("prior_cursor:", prior_cursor)

        page_size = event["queryStringParameters"].get("pageSize", 10)
        if not isinstance(page_size, int):
            page_size = int(page_size)

        page_direction_qs = event["queryStringParameters"].get("pageDirection", True)
        if page_direction_qs == "false":
            page_direction = False

        is_tag_query = event["queryStringParameters"].get("tagId", False)

    if is_tag_query:
        if prior_cursor:
            tag_id = event["queryStringParameters"]["tagId"]
            print(f"Filtering by tag: {tag_id}")
            results = table.query(
                IndexName="GSI3-inverted",
                KeyConditionExpression=Key("SK").eq(f"TAG#{tag_id}"),
                ProjectionExpression="PK,#name,#date,#url,tag_name",
                ExpressionAttributeNames={
                    "#date": "date",
                    "#name": "name",
                    "#url": "url",
                },
                Limit=page_size,
                ScanIndexForward=page_direction,
                ExclusiveStartKey=json.loads(prior_key),
                FilterExpression=Attr("model").eq("TAG-RELATION"),
            )
        else:
            tag_id = event["queryStringParameters"]["tagId"]
            print(f"Filtering by tag: {tag_id}")
            results = table.query(
                IndexName="GSI3-inverted",
                KeyConditionExpression=Key("SK").eq(f"TAG#{tag_id}"),
                ProjectionExpression="PK,#name,#date,#url,tag_name",
                ExpressionAttributeNames={
                    "#date": "date",
                    "#name": "name",
                    "#url": "url",
                },
                Limit=page_size,
                FilterExpression=Attr("model").eq("TAG-RELATION"),
            )
    else:
        if prior_cursor:
            results = table.query(
                IndexName="GSI1-getEventsByDate",
                KeyConditionExpression=Key("model").eq("EVENT"),
                ProjectionExpression="PK,#name,#date,#url",
                ExpressionAttributeNames={
                    "#date": "date",
                    "#name": "name",
                    "#url": "url",
                },
                Limit=page_size,
                ScanIndexForward=page_direction,
                ExclusiveStartKey=json.loads(prior_key),
            )
        else:
            results = table.query(
                IndexName="GSI1-getEventsByDate",
                KeyConditionExpression=Key("model").eq("EVENT"),
                ProjectionExpression="PK,#name,#date,#url",
                ExpressionAttributeNames={
                    "#date": "date",
                    "#name": "name",
                    "#url": "url",
                },
                Limit=page_size,
            )

    response["statusCode"] = 200

    transformed_results = transform_results(results["Items"])
    return_body["items"] = transformed_results

    cursor = {
        "before": None,
        "hasBefore": False,
        "after": None,
        "hasAfter": False,
    }

    next_key = results.get("LastEvaluatedKey", None)

    if next_key:
        cursor["after"] = encode_cursor(json.dumps(next_key))
        cursor["hasAfter"] = True
    if prior_cursor:
        cursor["before"] = prior_cursor
        cursor["hasBefore"] = True

    return_body["cursor"] = cursor
    response["body"] = json.dumps(return_body)

    return response


def decode_cursor(msg):
    b64_bytes = msg.encode("ascii")
    msg_bytes = base64.b64decode(b64_bytes)
    return msg_bytes.decode("ascii")


def encode_cursor(msg):
    msg_bytes = msg.encode("ascii")
    b64_bytes = base64.b64encode(msg_bytes)
    return b64_bytes.decode("ascii")


def transform_results(results):
    return_data = []

    for record in results:
        temp = {}
        for key, value in record.items():
            if key == "PK":
                temp["id"] = record[key].split("#")[1]
            else:
                temp[key] = record[key]
        return_data.append(temp)

    return return_data
