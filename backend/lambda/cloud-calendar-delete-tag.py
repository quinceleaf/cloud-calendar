import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    dynamodb = boto3.client("dynamodb")

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

    # query all records (event and relations) to delete
    records_to_delete = table.query(
        IndexName="GSI3-inverted", KeyConditionExpression=Key("SK").eq(tag_id),
    )
    print(f"{len(records_to_delete['Items'])} records to delete")

    transaction_queue = []

    for record in records_to_delete["Items"]:
        record_delete = {
            "Delete": {
                "TableName": "Events",
                "Key": {"PK": {"S": record["PK"]}, "SK": {"S": record["SK"]},},
            },
        }
        transaction_queue.append(record_delete)

    try:
        results = dynamodb.transact_write_items(TransactItems=transaction_queue)
        response_message = (
            f"Deleted tag {tag_id} and {len(transaction_queue)-1} relations"
        )
        print(response_message)
        response["statusCode"] = 200
    except Exception as e:
        error_flag = True
        response_message = f"ERROR could not delete tag {tag_id} and {len(transaction_queue)-1} relations"
        print(response_message)
        print(e)
        response["statusCode"] = 500

    response["body"] = response_message

    return response
