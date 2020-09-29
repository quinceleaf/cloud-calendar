import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def transform_results(results):
    return_data = []

    if isinstance(results, dict):
        temp = {}
        for key, value in results.items():
            if key == "PK":
                temp["id"] = results[key].split("#")[1]
            else:
                temp[key] = results[key]
        return_data.append(temp)

    if isinstance(results, list):
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
        "headers": {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
    }

    tag_id = f"TAG#{event['pathParameters']['id']}"

    results = table.get_item(
        Key={"PK": tag_id, "SK": tag_id},
        ProjectionExpression="PK,#name,date_added,date_updated",
        ExpressionAttributeNames={"#name": "name"},
    )

    response["statusCode"] = 200

    transformed_results = transform_results(results["Item"])
    response["body"] = json.dumps(transformed_results)

    return response
