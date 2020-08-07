from pprint import pprint
import uuid
import boto3

new_event = {
    "date": "2020-09-02T10:00:00.00Z",
    "name": "SRE and Azure DevOps",
    "model": "EVENT",
    "tags": [{"id": "TAG#58f16917-3eb3-4997-996c-45ed89a9e07c", "name": "azure"}],
    "url": "https://www.twitch.tv/microsoftdeveloper",
}

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"


def put_event(event, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")

    insert_uuid = f"EVENT#{uuid.uuid4()}"
    response = table.put_item(
        Item={
            "PK": insert_uuid,
            "SK": insert_uuid,
            "date": event["date"],
            "model": "EVENT",
            "name": event["name"],
            "url": event["url"],
        }
    )

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

    return response


if __name__ == "__main__":
    event_response = put_event(new_event)
    print("Put event succeeded:")
    pprint(event_response, sort_dicts=False)
