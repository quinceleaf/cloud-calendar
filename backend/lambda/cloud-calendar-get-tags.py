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

    results = table.query(
        IndexName="GSI2-getObjectsByModel",
        KeyConditionExpression=Key("model").eq("TAG"),
        ProjectionExpression="PK,#name",
        ExpressionAttributeNames={"#name": "name"},
    )

    response["statusCode"] = 200

    transformed_results = transform_results(results["Items"])
    response["body"] = json.dumps(transformed_results)

    return response
