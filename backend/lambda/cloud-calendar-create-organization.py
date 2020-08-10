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

    payload = json.loads(event["body"])["organization"]

    org_id = f"ORG#{uuid.uuid4()}"
    org_model = "ORGANIZATION"
    org_name = payload["name"]

    try:
        results = table.update_item(
            Key={"PK": org_id, "SK": org_id},
            UpdateExpression="SET #name=:n, model=:m",
            ExpressionAttributeValues={":n": org_name, ":m": org_model},
            ExpressionAttributeNames={"#name": "name"},
            ReturnValues="ALL_NEW",
        )
        response["statusCode"] = 200
        response["body"] = json.dumps(results["Attributes"])
    except:
        response["statusCode"] = 500
        response_message = (
            f"ERROR Could not create organization item {org_id} {org_name}"
        )
        print(response_message)
        response["body"] = response_message

    return response