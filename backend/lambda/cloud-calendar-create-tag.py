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
    tag_id = f"TAG#{insert_id}"
    tag_model = "TAG"
    tag_name = payload["name"]
    date_added = dt.datetime.now().isoformat()
    date_updated = dt.datetime.now().isoformat()

    try:
        results = table.put_item(
            Item={
                "PK": tag_id,
                "SK": tag_id,
                "model": tag_model,
                "name": tag_name,
                "date_added": date_added,
                "date_updated": date_updated,
            },
            ConditionExpression="attribute_not_exists(SK)",
        )
        response_info = {}
        response_info["status"] = "success"
        response_info["data"] = {
            "id": insert_id,
            "name": tag_name,
            "date_added": date_added,
            "date_updated": date_updated,
        }
        response_info["message"] = f"Created tag {tag_id}"
        response_message = json.dumps(response_info)
        print(f"Created tag {tag_id}")
        response["statusCode"] = 201

    except:
        response["statusCode"] = 500
        response_message = f"ERROR Could not create tag item {tag_id} {tag_name}"
        print(response_message)

    response["body"] = response_message

    return response
