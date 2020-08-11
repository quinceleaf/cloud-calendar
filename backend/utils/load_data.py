import datetime as dt
import json
import uuid
import boto3


# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"


def convert_timestamp(timestamp):
    k = dt.datetime.strptime(timestamp, "%Y-%m-%dT%H:%M:%S.%f%z")
    return dt.datetime.isoformat(k)


def load_data(tags, orgs, events, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")

    # tags
    counter_tags = 0
    for tag in tags:

        # Create tag record
        try:
            table.put_item(
                Item={
                    "PK": tag["id"],
                    "SK": tag["id"],
                    "model": "TAG",
                    "name": tag["name"],
                    "date_added": dt.datetime.now().isoformat(),
                    "date_updated": dt.datetime.now().isoformat(),
                }
            )
            counter_tags += 1
        except:
            print(f"ERROR: could not create tag {tag['name']}")

    # organizations
    counter_orgs = 0
    for org in orgs:

        # Create org record
        try:
            table.put_item(
                Item={
                    "PK": org["id"],
                    "SK": org["id"],
                    "model": "ORGANIZATION",
                    "url": org.get("url", None),
                    "name": org["name"],
                    "date_added": dt.datetime.now().isoformat(),
                    "date_updated": dt.datetime.now().isoformat(),
                }
            )
            counter_orgs += 1
        except:
            print(f"ERROR: could not create organization {org['name']}")

    # events and relations
    counter_events = 0
    counter_event_tag_relations = 0
    counter_event_org_relations = 0

    for event in events:
        insert_uuid = f"EVENT#{uuid.uuid4()}"

        # tag_list = [{"id": tag["id"], "name": tag[] for tag in event["tags"]]

        # Create event record
        try:
            table.put_item(
                Item={
                    "PK": insert_uuid,
                    "SK": insert_uuid,
                    "date": convert_timestamp(event["date"]),
                    "model": "EVENT",
                    "name": event["name"],
                    "url": event["url"],
                    "description": event.get("description", None),
                    "date_added": dt.datetime.now().isoformat(),
                    "date_updated": dt.datetime.now().isoformat(),
                }
            )
            counter_events += 1
        except:
            print(f"ERROR: could not create event {event['name']}")
            continue

        # Create event-tag relation records
        for tag in event.get("tags", []):
            try:
                table.put_item(
                    Item={
                        "PK": insert_uuid,
                        "SK": tag["id"],
                        "date": event["date"],
                        "name": event["name"],
                        "url": event["url"],
                        "model": "TAG-RELATION",
                        "GSI1-PK": tag["id"],
                        "relation_name": tag["name"],
                        "description": event.get("description", None),
                        "date_added": dt.datetime.now().isoformat(),
                        "date_updated": dt.datetime.now().isoformat(),
                    }
                )
                counter_event_tag_relations += 1
            except:
                print(
                    f"ERROR: could not create event-tag relation for event {event['name']}, tag {tag['name']}"
                )

        # Create event-org relation records
        for org in event.get("orgs", []):
            try:
                table.put_item(
                    Item={
                        "PK": insert_uuid,
                        "SK": org["id"],
                        "date": event["date"],
                        "name": event["name"],
                        "url": event["url"],
                        "model": "ORG-RELATION",
                        "GSI1-PK": org["id"],
                        "relation_name": org["name"],
                        "description": event.get("description", None),
                        "date_added": dt.datetime.now().isoformat(),
                        "date_updated": dt.datetime.now().isoformat(),
                    }
                )
                counter_event_org_relations += 1
            except:
                print(
                    f"ERROR: could not create event-org relation for event {event['name']}, org {org['name']}"
                )

    return (
        counter_tags,
        counter_orgs,
        counter_events,
        counter_event_tag_relations,
        counter_event_org_relations,
    )


if __name__ == "__main__":
    with open("tags.json") as json_tags_file:
        with open("orgs.json") as json_orgs_file:
            with open("events.json") as json_events_file:
                tag_list = json.load(json_tags_file)
                org_list = json.load(json_orgs_file)
                event_list = json.load(json_events_file)
    (
        counter_tags,
        counter_orgs,
        counter_events,
        counter_event_tag_relations,
        counter_event_org_relations,
    ) = load_data(tag_list, org_list, event_list)
    print(f"{counter_tags + 1} tags loaded")
    print(f"{counter_orgs + 1} organizations loaded")
    print(f"{counter_events + 1} events loaded")
    print(f"{counter_event_tag_relations + 1} event-tag relations loaded")
    print(f"{counter_event_org_relations + 1} event-org relations loaded")

