import base64
import datetime as dt
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

    is_tag_query = False
    date_threshold = dt.date.today().isoformat()

    if event.get("queryStringParameters", False):
        is_tag_query = event["queryStringParameters"].get("tagId", False)

    if is_tag_query:
        tag_id = event["queryStringParameters"]["tagId"]
        print(f"Filtering by tag: {tag_id}")
        results = table.query(
            # IndexName="GSI3-inverted",
            # KeyConditionExpression=Key("SK").eq(f"TAG#{tag_id}"),
            # ProjectionExpression="PK,#name,#date,#url,tag_name",
            # ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url",},
            # FilterExpression=Attr("model").eq("TAG-RELATION")
            # & Attr("date").gte(date_threshold),
            IndexName="GSI1-getEventsByDate",
            KeyConditionExpression=Key("model").eq("TAG-RELATION")
            & Key("date").gte(date_threshold),
            ProjectionExpression="PK,#name,#date,#url,description",
            ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url",},
            FilterExpression=Attr("SK").eq(f"TAG#{tag_id}"),
        )
    else:
        results = table.query(
            IndexName="GSI1-getEventsByDate",
            KeyConditionExpression=Key("model").eq("EVENT"),
            ProjectionExpression="PK,#name,#date,#url,description",
            ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url",},
            FilterExpression=Attr("date").gte(date_threshold),
        )

    response["statusCode"] = 200

    transformed_results = transform_results(results["Items"])
    response["body"] = json.dumps(transformed_results)

    return response


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
