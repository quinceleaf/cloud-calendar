from pprint import pprint
import boto3
from botocore.exceptions import ClientError


# Original event included for check/comparison
original_event = {
    "SK": "EVENT#77f28eed-4548-4e1e-bea1-73f64ac1fd4c",
    "date": "2020-08-12T13:00:00.00Z",
    "name": "Start your journey into Azure Blockchain Solutions",
    "model": "EVENT",
    "PK": "EVENT#77f28eed-4548-4e1e-bea1-73f64ac1fd4c",
    "url": "https://www.twitch.tv/microsoftdeveloper",
}

new_event = {
    "SK": "EVENT#77f28eed-4548-4e1e-bea1-73f64ac1fd4c",
    "date": "2020-08-10T13:00:00.00Z",
    "name": "Start your journey into Azure Blockchain Solutions",
    "model": "EVENT",
    "PK": "EVENT#77f28eed-4548-4e1e-bea1-73f64ac1fd4c",
    "url": "https://www.twitch.tv/microsoftdeveloper",
}

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"

# Parameters
# NOTE the PK/SK for this record from the sample data set in events.json
# will change with each rebuilding of the table - update the
# PK/SK as necessary to run this

# NOTE only date, name and url are logical candidate for update/change


# TO-DO : Query and update any event-tag relations that contain updated attributes


def update_event(event, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")

    response = table.update_item(
        Key={"PK": event["PK"], "SK": event["SK"]},
        UpdateExpression="SET #date=:d, #name=:n, #url=:u",
        ExpressionAttributeValues={
            ":d": event["date"],
            ":n": event["name"],
            ":u": event["url"],
        },
        ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url"},
        ReturnValues="ALL_NEW",
    )
    return response


if __name__ == "__main__":
    updated_event = update_event(new_event)
    if updated_event:
        print("Update event succeeded:")
        pprint(updated_event, sort_dicts=False)
