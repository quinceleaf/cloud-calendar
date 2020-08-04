import json
import boto3


def load_events(events, dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:8000")

    table = dynamodb.Table("Events")
    counter = 0
    for event in event_list:
        table.put_item(
            Item={
                "PK": "event",
                "SK": f'${event["details"]["date"]}#${event["name"]}',
                "name": event["name"],
                "details": event["details"],
            }
        )
        counter += 1
    return counter


if __name__ == "__main__":
    with open("events.json") as json_file:
        event_list = json.load(json_file)
    counter = load_events(event_list)
    print(f"{counter + 1} events loaded")

