import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


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


def lambda_handler(event, context):
    client = boto3.resource("dynamodb")
    table = client.Table("Events")

    response = {
        "isBase64Encoded": "false",
        "headers": {},
    }

    isTagQuery = event.get("queryStringParameters", False) and event[
        "queryStringParameters"
    ].get("tag", False)

    if isTagQuery:
        tag_id = event["queryStringParameters"]["tag"]
        print(f"Filtering by tag: {tag_id}")
        results = table.query(
            IndexName="GSI1-getEventsForRelation",
            KeyConditionExpression=Key("GSI1-PK").eq(f"TAG#{tag_id}"),
            ProjectionExpression="PK,#name,#date,#url,description,tag_name",
            ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url"},
        )
    else:
        results = table.query(
            IndexName="GSI2-getObjectsByModel",
            KeyConditionExpression=Key("model").eq("EVENT"),
            ProjectionExpression="PK,#name,#date,#url,description",
            ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url"},
        )

    response["statusCode"] = 200

    transformed_results = transform_results(results["Items"])
    response["body"] = json.dumps(transformed_results)

    return response
