import datetime as dt
import json
import uuid
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

    payload = json.loads(event["body"])

    base_id = event["pathParameters"]["id"]
    org_id = f"ORG#{base_id}"
    org_name = payload["name"]
    org_url = payload["url"]
    date_added = ""
    date_updated = ""

    # change of "name" is only valid PUT transformation
    # put org
    # put event-org relations

    transaction_queue = []

    # query all records (org and relations) to update
    records_to_update = table.query(
        IndexName="GSI3-inverted", KeyConditionExpression=Key("SK").eq(org_id),
    )
    print(f"{len(records_to_update['Items'])} records to update")

    # update org and existing relations
    for record in records_to_update["Items"]:

        if record["model"] == "ORGANIZATION":
            date_added = record["date_added"]
            date_updated = dt.datetime.now().isoformat()

            org_update = {
                "Put": {
                    "TableName": "Events",
                    "Item": {
                        "PK": {"S": record["PK"]},
                        "SK": {"S": record["SK"]},
                        "model": {"S": record["model"]},
                        "name": {"S": org_name},
                        "url": {"S": org_url},
                        "date_added": {"S": date_added},
                        "date_updated": {"S": date_updated},
                    },
                },
            }
        else:
            org_update = {
                "Put": {
                    "TableName": "Events",
                    "Item": {
                        "PK": {"S": record["PK"]},
                        "SK": {"S": record["SK"]},
                        "date": {"S": record["date"]},
                        "timezone": {"S": record["timezone"]},
                        "expires": {"S": record["expires"]},
                        "description": {"S": record["description"]},
                        "model": {"S": record["model"]},
                        "name": {"S": record["name"]},
                        "relation_name": {"S": org_name},
                        "url": {"S": record["url"]},
                        "date_added": {"S": record["date_added"]},
                        "date_updated": {"S": dt.datetime.now().isoformat()},
                    },
                },
            }
        transaction_queue.append(org_update)

    try:
        results = dynamodb.transact_write_items(TransactItems=transaction_queue)

        response_info = {}
        response_info["status"] = "success"
        response_info["data"] = {
            "id": base_id,
            "name": org_name,
            "url": org_url,
            "date_added": date_added,
            "date_updated": date_updated,
        }
        response_info[
            "message"
        ] = f"Updated organization {base_id} and {len(transaction_queue)-1} relations"
        response_message = json.dumps(response_info)

        print(
            f"Updated organization {base_id} and {len(transaction_queue)-1} relations"
        )
        response["statusCode"] = 200

    except Exception as e:
        response_message = f"ERROR could not update organization {base_id} and {len(transaction_queue)-1} relations"
        print(response_message)
        print(e)
        response["statusCode"] = 500

    response["body"] = response_message

    return response
