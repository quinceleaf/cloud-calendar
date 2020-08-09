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
        tag_id = event["pathParameters"]["tagId"]
    except:
        tag_id = False
        response["statusCode"] = 500
        response["body"] = "Unable to parse parameters"

    if tag_id:
        table.delete_item(Key={"PK": tag_id, "SK": tag_id,},)
        response["statusCode"] = 200
        response["body"] = json.dumps({"message": "Tag deleted"})

    return response
