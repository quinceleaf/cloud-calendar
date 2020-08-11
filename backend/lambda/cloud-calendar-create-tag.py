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
        "headers": {},
    }

    payload = json.loads(event["body"])

    tag_id = f"TAG#{uuid.uuid4()}"
    tag_model = "TAG"
    tag_name = payload["name"]
    date_added = dt.datetime.now().isoformat()
    date_updated = dt.datetime.now().isoformat()

    try:
        results = table.update_item(
            Key={"PK": tag_id, "SK": tag_id},
            UpdateExpression="SET #name=:n, model=:m, date_added=:dta, date_updated=:dtu",
            ExpressionAttributeValues={
                ":n": tag_name,
                ":m": tag_model,
                ":dta": date_added,
                ":dtu": date_updated,
            },
            ExpressionAttributeNames={"#name": "name"},
            ReturnValues="ALL_NEW",
        )
        response["statusCode"] = 200
        response["body"] = json.dumps(results["Attributes"])

    except:
        response["statusCode"] = 500
        response_message = f"ERROR Could not create tag item {tag_id} {tag_name}"
        print(response_message)
        response["body"] = response_message

    return response
