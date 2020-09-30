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
    is_organization_query = False
    date_threshold = dt.date.today().isoformat()

    if event.get("queryStringParameters", False):
        is_tag_query = event["queryStringParameters"].get("tag", False)
        is_organization_query = event["queryStringParameters"].get(
            "organization", False
        )

    if is_tag_query:
        tag_id = event["queryStringParameters"]["tag"]
        print(f"Filtering by tag: {tag_id}")
        results = table.query(
            IndexName="GSI1-getEventsByDate",
            KeyConditionExpression=Key("model").eq("TAG-RELATION")
            & Key("date").gte(date_threshold),
            ProjectionExpression="PK,SK,#name,#date,#timezone,expires,#url,description,model,date_added,date_updated",
            ExpressionAttributeNames={
                "#date": "date",
                "#timezone": "timezone",
                "#name": "name",
                "#url": "url",
            },
            FilterExpression=Attr("SK").eq(f"TAG#{tag_id}"),
        )
    elif is_organization_query:
        organization_id = event["queryStringParameters"]["organization"]
        print(f"Filtering by organization: {organization_id}")
        results = table.query(
            IndexName="GSI1-getEventsByDate",
            KeyConditionExpression=Key("model").eq("ORG-RELATION")
            & Key("date").gte(date_threshold),
            ProjectionExpression="PK,SK,#name,#date,#timezone,expires,#url,description,model,date_added,date_updated",
            ExpressionAttributeNames={
                "#date": "date",
                "#timezone": "timezone",
                "#name": "name",
                "#url": "url",
            },
            FilterExpression=Attr("SK").eq(f"ORG#{organization_id}"),
        )
    else:
        results = table.query(
            IndexName="GSI1-getEventsByDate",
            KeyConditionExpression=Key("model").eq("EVENT")
            & Key("date").gte(date_threshold),
            ProjectionExpression="PK,#name,#date,#timezone,expires,#url,description,model,date_added,date_updated",
            ExpressionAttributeNames={
                "#date": "date",
                "#timezone": "timezone",
                "#name": "name",
                "#url": "url",
            },
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
            if key == "expires":
                temp["expires"] = int(record[key])
            else:
                temp[key] = record[key]
        return_data.append(temp)

    return return_data
