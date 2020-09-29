import datetime as dt
import json
import uuid
import boto3
from boto3.dynamodb.conditions import Key, Attr


def det_changes(existing_data, new_data):

    # for record in existing_data:
    conv_existing = [
        {"id": record["SK"], "name": record["relation_name"]}
        for record in existing_data
        if ((record["model"] == "ORG-RELATION") or (record["model"] == "TAG-RELATION"))
    ]

    conv_new = [
        {"id": f"TAG#{record['id']}", "name": record["name"]}
        for record in new_data.get("tags", [])
    ] + [
        {"id": f"ORG#{record['id']}", "name": record["name"]}
        for record in new_data.get("organizations", [])
    ]

    to_add = [val for val in conv_new if val not in conv_existing]

    to_delete = [val for val in conv_existing if val not in conv_new]

    return to_add, to_delete


def screen_against_list_of_dicts(key, value, list_of_dictionaries):
    if len([element for element in list_of_dictionaries if element[key] == value]) > 0:
        return True


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
    event_id = f"EVENT#{base_id}"
    event_date = payload["date"]  # passed as UTC ISO string
    event_expires = str(payload["expires"])
    event_timezone = payload["timezone"]  # original timezone of event
    event_description = payload.get("description", None)
    event_model = "EVENT"
    event_name = payload["name"]
    event_tags = payload.get("tags", [])
    event_orgs = payload.get("organizations", [])
    event_url = payload["url"]
    event_date_added = payload["date_added"]
    event_date_updated = dt.datetime.now().isoformat()

    # put event
    # put event-tag relations
    # delete out-dated event-tag relations
    # put event-org relations
    # delete out-dated event-org relations

    transaction_queue = []

    # query all records (event and relations) to update
    records_to_update = table.query(KeyConditionExpression=Key("PK").eq(event_id),)
    print(f"{len(records_to_update['Items'])} records to update")

    # determine relations to add & delete
    records_to_add, records_to_delete = det_changes(records_to_update["Items"], payload)

    # delete out-dated relations
    print("records_to_delete:")
    print(records_to_delete)

    for record in records_to_delete:
        relation_delete = {
            "Delete": {
                "TableName": "Events",
                "Key": {"PK": {"S": event_id}, "SK": {"S": record["id"]},},
            },
        }
        transaction_queue.append(relation_delete)

    # add new relations

    print("records_to_add:")
    print(records_to_add)

    for record in records_to_add:
        relation_add = {
            "Put": {
                "TableName": "Events",
                "Item": {
                    "PK": {"S": event_id},
                    "SK": {"S": record["id"]},
                    "date": {"S": event_date},
                    "expires": {"S": event_expires},
                    "timezone": {"S": event_timezone},
                    "description": {"S": event_description},
                    "model": {"S": f"{record['id'].split('#')[0]}-RELATION"},
                    "name": {"S": event_name},
                    "url": {"S": event_url},
                    "relation_name": {"S": record["name"]},
                    "date_added": {"S": event_date_added},
                    "date_updated": {"S": event_date_updated},
                },
                "ConditionExpression": "attribute_not_exists(SK)",
                "ReturnValuesOnConditionCheckFailure": "ALL_OLD",
            },
        }
        transaction_queue.append(relation_add)

    print("records_to_update:")
    print(records_to_update["Items"])

    # update event and existing relations
    for record in records_to_update["Items"]:
        # screen out records included as deletions
        # to avoid a validation error
        if screen_against_list_of_dicts("id", record["SK"], records_to_delete):
            continue

        if record["model"] == "EVENT":
            event_update = {
                "Put": {
                    "TableName": "Events",
                    "Item": {
                        "PK": {"S": event_id},
                        "SK": {"S": event_id},
                        "date": {"S": event_date},
                        "expires": {"S": event_expires},
                        "timezone": {"S": event_timezone},
                        "description": {"S": event_description},
                        "model": {"S": record["model"]},
                        "name": {"S": event_name},
                        "url": {"S": event_url},
                        "date_added": {"S": event_date_added},
                        "date_updated": {"S": event_date_updated},
                    },
                },
            }
        else:
            event_update = {
                "Put": {
                    "TableName": "Events",
                    "Item": {
                        "PK": {"S": event_id},
                        "SK": {"S": record["SK"]},
                        "date": {"S": event_date},
                        "expires": {"S": event_expires},
                        "timezone": {"S": event_timezone},
                        "description": {"S": event_description},
                        "model": {"S": record["model"]},
                        "name": {"S": event_name},
                        "relation_name": {"S": record.get("relation_name")},
                        "url": {"S": event_url},
                        "date_added": {"S": event_date_added},
                        "date_updated": {"S": event_date_updated},
                    },
                },
            }
        transaction_queue.append(event_update)

    print("TransactionQueue:")
    print(transaction_queue)

    try:
        results = dynamodb.transact_write_items(TransactItems=transaction_queue)
        response_info = {}
        response_info["status"] = "success"
        response_info["data"] = {
            "id": base_id,
            "date": event_date,
            "expires": event_expires,
            "timezone": event_timezone,
            "description": event_description,
            "model": event_model,
            "name": event_name,
            "url": event_url,
            "date_added": event_date_added,
            "date_updated": event_date_updated,
        }
        response_info[
            "message"
        ] = f"Updated event {base_id} and {len(transaction_queue)-1} relations"
        response_message = json.dumps(response_info)
        print(f"Updated event {base_id} and {len(transaction_queue)-1} relations")
        response["statusCode"] = 201

    except Exception as e:
        response_message = f"ERROR could not update event {base_id} and {len(transaction_queue)-1} relations"
        print(response_message)
        print(e)
        response["statusCode"] = 500

    response["body"] = response_message

    return response
