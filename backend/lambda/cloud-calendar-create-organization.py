import datetime as dt
import json
import uuid
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

    payload = json.loads(event["body"])

    insert_id = str(uuid.uuid4())
    org_id = f"ORG#{insert_id}"
    org_model = "ORGANIZATION"
    org_name = payload["name"]
    org_url = payload["url"]
    date_added = dt.datetime.now().isoformat()
    date_updated = dt.datetime.now().isoformat()

    try:
        results = table.put_item(
            Item={
                "PK": org_id,
                "SK": org_id,
                "model": org_model,
                "name": org_name,
                "url": org_url,
                "date_added": date_added,
                "date_updated": date_updated,
            },
            ConditionExpression="attribute_not_exists(SK)",
        )
        response_info = {}
        response_info["status"] = "success"
        response_info["data"] = {
            "id": insert_id,
            "name": org_name,
            "url": org_url,
            "date_added": date_added,
            "date_updated": date_updated,
        }
        response_info["message"] = f"Created organization {insert_id}"
        response_message = json.dumps(response_info)
        print(f"Created organization {insert_id}")
        response["statusCode"] = 201

    except:
        response["statusCode"] = 500
        response_message = (
            f"ERROR Could not create organization item {insert_id} {org_name}"
        )
        print(response_message)

    response["body"] = response_message

    return response
