import datetime as dt
import json
import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):
    # client = boto3.resource('dynamodb')
    dynamodb = boto3.client("dynamodb")

    # table = client.Table("Events")

    response = {
        "isBase64Encoded": "false",
        "headers": {},
    }

    payload = json.loads(event["body"])

    event_id = f"EVENT#{uuid.uuid4()}"
    event_date = payload["date"]
    event_description = payload.get("description", None)
    event_model = "EVENT"
    event_name = payload["name"]
    event_tags = payload.get("tags", None)
    event_orgs = payload.get("orgs", None)
    event_url = payload["url"]

    transaction_queue = []

    event_create = {
        "Put": {
            "TableName": "Events",
            "Item": {
                "PK": {"S": event_id},
                "SK": {"S": event_id},
                "date": {"S": event_date},
                "description": {"S": event_description},
                "model": {"S": event_model},
                "name": {"S": event_name},
                "url": {"S": event_url},
                "date_added": {"S": dt.datetime.now().isoformat()},
                "date_updated": {"S": dt.datetime.now().isoformat()},
            },
            "ConditionExpression": "attribute_not_exists(SK)",
            "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
        },
    }
    transaction_queue.append(event_create)

    for tag in event_tags:

        tag_id = f"TAG#{tag['id']}"
        tag_model = "TAG-RELATION"
        tag_name = tag["name"]

        relation_create = {
            "Put": {
                "TableName": "Events",
                "Item": {
                    "PK": {"S": event_id},
                    "SK": {"S": tag_id},
                    "date": {"S": event_date},
                    "description": {"S": event_description},
                    "model": {"S": tag_model},
                    "name": {"S": event_name},
                    "GSI1-PK": {"S": tag_id},
                    "relation_name": {"S": tag_name},
                    "url": {"S": event_url},
                    "date_added": {"S": dt.datetime.now().isoformat()},
                    "date_updated": {"S": dt.datetime.now().isoformat()},
                },
                "ConditionExpression": "attribute_not_exists(SK)",
                "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
            },
        }
        transaction_queue.append(relation_create)

    for org in event_orgs:

        org_id = f"ORG#{tag['id']}"
        org_model = "ORG-RELATION"
        org_name = org["name"]

        relation_create = {
            "Put": {
                "TableName": "Events",
                "Item": {
                    "PK": {"S": event_id},
                    "SK": {"S": org_id},
                    "date": {"S": event_date},
                    "description": {"S": event_description},
                    "model": {"S": org_model},
                    "name": {"S": event_name},
                    "GSI1-PK": {"S": org_id},
                    "relation_name": {"S": org_name},
                    "url": {"S": event_url},
                    "date_added": {"S": dt.datetime.now().isoformat()},
                    "date_updated": {"S": dt.datetime.now().isoformat()},
                },
                "ConditionExpression": "attribute_not_exists(SK)",
                "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
            },
        }
        transaction_queue.append(relation_create)

    try:
        response = dynamodb.transact_write_items(TransactItems=transaction_queue)
        response_message = (
            f"Created event {event_id} and {len(transaction_queue)-1} relations"
        )
        print(response_message)
        response["statusCode"] = 200
        # return True
    except Exception as e:
        error_flag = True
        response_message = f"ERROR could not create event {event_id} and {len(transaction_queue)-1} relations"
        print(response_message)
        print(e)
        response["statusCode"] = 500

    response["body"] = response_message

    return response
