import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    client = boto3.resource("dynamodb")
    table = client.Table("Events")

    response = {
        "isBase64Encoded": "false",
        "headers": {},
    }

    try:
        event_id = event["pathParameters"]["eventId"]
    except:
        event_id = False
        response["statusCode"] = 500
        response["body"] = "Unable to parse parameters"

    if event_id:
        table.delete_item(Key={"PK": event_id, "SK": event_id,},)
        response["statusCode"] = 200
        response["body"] = json.dumps({"message": "Event deleted"})

    return response
