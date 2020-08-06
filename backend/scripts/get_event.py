# from boto3.dynamodb.conditions import Key, Attr
from random import sample
import boto3

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"

# Parameters
# NOTE the IDs listed below will change
# with each rebuilding of the table
# - update the set as necessary to run this

event_ids = [
    "EVENT#05079ca8-45e1-4ecb-978a-f8c4aacc9928",
    "EVENT#06fec634-cbcc-48b1-b420-cbfdafbcc572",
    "EVENT#1617b231-4c0f-46a5-a6c3-9940e8c875e3",
    "EVENT#1db97899-f802-4af5-aef8-88f082c8086b",
]
event_id = sample(event_ids, 1)[0]
print(f"Will attempt to get event with Event ID: {event_id}")


def get_event(id, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")

    response = table.get_item(Key={"PK": id, "SK": id,},)

    return response["Item"]


if __name__ == "__main__":
    query_result = get_event(event_id)
    print("Query result:", query_result)
