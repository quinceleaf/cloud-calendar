import json
import uuid
import boto3


# Settings
LOCAL_DYNAMODB = True
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"


def load_data(events, tags, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")

    counter_tags = 0
    for tag in tag_list:

        # Creat tag record
        table.put_item(
            Item={
                "PK": tag["id"],
                "SK": tag["id"],
                "model": "TAG",
                "name": tag["name"],
            }
        )
        counter_tags += 1

    counter_events = 0
    counter_event_tag_relations = 0
    for event in event_list:
        insert_uuid = f"EVENT{uuid.uuid4()}"

        # Create event record
        table.put_item(
            Item={
                "PK": insert_uuid,
                "SK": insert_uuid,
                "date": event["date"],
                "model": "EVENT",
                "name": event["name"],
                "url": event["url"],
            }
        )
        counter_events += 1

        # Create event-tag relation records
        for tag in event["tags"]:
            table.put_item(
                Item={
                    "PK": insert_uuid,
                    "SK": tag["id"],
                    "date": event["date"],
                    "name": event["name"],
                    "url": event["url"],
                    "GSI1-PK": tag["id"],
                    "tag": f'TAG#{tag["name"]}',
                }
            )
            counter_event_tag_relations += 1

    return counter_tags, counter_events, counter_event_tag_relations


if __name__ == "__main__":
    with open("tags.json") as json_tags_file:
        with open("events.json") as json_events_file:
            tag_list = json.load(json_tags_file)
            event_list = json.load(json_events_file)
    counter_tags, counter_events, counter_event_tag_relations = load_data(
        tag_list, event_list
    )
    print(f"{counter_tags + 1} tags loaded")
    print(f"{counter_events + 1} events loaded")
    print(f"{counter_event_tag_relations + 1} event-tag relations loaded")

