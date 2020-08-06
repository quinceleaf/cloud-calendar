from pprint import pprint
import boto3
from boto3.dynamodb.conditions import Key, Attr

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"

# Parameters
# valid model names are:
# EVENT
# TAG


def query_by_model(model, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")
    response = table.query(
        IndexName="GSI2-getObjectsByModel",
        KeyConditionExpression=Key("model").eq(model),
    )
    return response["Items"]


if __name__ == "__main__":
    query_result = query_by_model("EVENT")
    pprint(query_result, sort_dicts=False)
