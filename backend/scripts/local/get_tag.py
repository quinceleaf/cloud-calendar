# from boto3.dynamodb.conditions import Key, Attr
from random import sample
import boto3

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"

# Parameters
tag_ids = [
    "TAG#0be85da1-96ca-4bde-8055-e57dadd1b899",
    "TAG#0e88277c-28d9-494e-9bbb-3de5f78d09a5",
    "TAG#13e1a064-b81d-477a-9cea-0c3f85c5f065",
    "TAG#19bdf4fe-652c-4ee2-9f6b-bc0af148ca2c",
    "TAG#215b1891-85f7-44d8-9bf2-f8c2686bf76a",
    "TAG#55e0bab4-488d-4ae4-9f80-81e6394bca01",
    "TAG#58f16917-3eb3-4997-996c-45ed89a9e07c",
    "TAG#6194af88-a0ad-4b16-ae9b-2b1f134ded94",
    "TAG#61cf2010-4ac2-473b-9195-24fc7a8cd57b",
    "TAG#646ef30a-53c1-4fe9-addd-603e0b0cf286",
]
tag_id = sample(tag_ids, 1)[0]
print(f"Will attempt to get tag with Tag ID: {tag_id}")


def get_tag(id, dynamodb=None):
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
    query_result = get_tag(tag_id)
    print("Query result:", query_result)
