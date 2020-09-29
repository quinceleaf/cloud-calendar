import datetime as dt
import json
import uuid

import boto3
from boto3.dynamodb.conditions import Key, Attr


def lambda_handler(event, context):

    dynamodb = boto3.client("dynamodb")

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
    event_id = f"EVENT#{insert_id}"
    event_date = payload["date"]  # passed as UTC ISO string
    event_expires = payload["expires"]
    event_timezone = payload["timezone"]  # original timezone of event
    event_description = payload.get("description", None)
    event_model = "EVENT"
    event_name = payload["name"]
    event_tags = payload.get("tags", None)
    event_orgs = payload.get("organizations", None)
    event_url = payload["url"]
    date_added = dt.datetime.now().isoformat()
    date_updated = dt.datetime.now().isoformat()

    transaction_queue = []

    event_create = {
        "Put": {
            "TableName": "Events",
            "Item": {
                "PK": {"S": event_id},
                "SK": {"S": event_id},
                "date": {"S": event_date},
                "expires": {"N": event_expires},
                "timezone": {"S": event_timezone},
                "description": {"S": event_description},
                "model": {"S": event_model},
                "name": {"S": event_name},
                "url": {"S": event_url},
                "date_added": {"S": date_added},
                "date_updated": {"S": date_updated},
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
                    "expires": {"N": event_expires},
                    "timezone": {"S": event_timezone},
                    "description": {"S": event_description},
                    "model": {"S": tag_model},
                    "name": {"S": event_name},
                    "relation_name": {"S": tag_name},
                    "url": {"S": event_url},
                    "date_added": {"S": date_added},
                    "date_updated": {"S": date_updated},
                },
                "ConditionExpression": "attribute_not_exists(SK)",
                "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
            },
        }
        transaction_queue.append(relation_create)

    for org in event_orgs:

        org_id = f"ORG#{org['id']}"
        org_model = "ORG-RELATION"
        org_name = org["name"]

        relation_create = {
            "Put": {
                "TableName": "Events",
                "Item": {
                    "PK": {"S": event_id},
                    "SK": {"S": org_id},
                    "date": {"S": event_date},
                    "expires": {"N": event_expires},
                    "timezone": {"S": event_timezone},
                    "description": {"S": event_description},
                    "model": {"S": org_model},
                    "name": {"S": event_name},
                    "relation_name": {"S": org_name},
                    "url": {"S": event_url},
                    "date_added": {"S": date_added},
                    "date_updated": {"S": date_updated},
                },
                "ConditionExpression": "attribute_not_exists(SK)",
                "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
            },
        }
        transaction_queue.append(relation_create)

    print(transaction_queue)
    try:
        results = dynamodb.transact_write_items(TransactItems=transaction_queue)
        response_info = {}
        response_info["status"] = "success"
        response_info["data"] = {
            "id": insert_id,
            "date": event_date,
            "expires": event_expires,
            "timezone": event_timezone,
            "description": event_description,
            "model": event_model,
            "name": event_name,
            "url": event_url,
            "date_added": date_added,
            "date_updated": date_updated,
        }
        response_info[
            "message"
        ] = f"Created event {event_id} and {len(transaction_queue)-1} relations"
        response_message = json.dumps(response_info)
        print(f"Created event {event_id} and {len(transaction_queue)-1} relations")
        response["statusCode"] = 201

    except Exception as e:
        response_message = f"ERROR could not create event {event_id} and {len(transaction_queue)-1} relations"
        print(
            f"ERROR could not create event {event_id} and {len(transaction_queue)-1} relations"
        )
        response["statusCode"] = 500

    response["body"] = response_message

    return response
