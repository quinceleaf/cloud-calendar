from pprint import pprint
from random import sample
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"

# Parameters
tag_ids = [
    "TAG#9ef8d16c-ce8d-43a0-af04-413d7d795145",
    "TAG#6a8cf8e8-61fc-4eca-8af9-df68dc1a6ba9",
]
tag_id = sample(tag_ids, 1)[0]
print(f"Will attempt to get events related to  Tag ID: {tag_id}")


def query_for_tag(id, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")
    response = table.query(
        IndexName="GSI1-getEventsForTag", KeyConditionExpression=Key("GSI1-PK").eq(id),
    )
    return response["Items"]


if __name__ == "__main__":
    query_result = query_for_tag(tag_id)
    pprint(query_result, sort_dicts=False)
