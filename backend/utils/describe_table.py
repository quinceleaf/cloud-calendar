from pprint import pprint
import boto3


# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"


def describe_events_table(dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.client("dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION)
        else:
            dynamodb = boto3.client("dynamodb", region_name=REGION)

    response = dynamodb.describe_table(TableName="Events",)
    return response


if __name__ == "__main__":
    response = describe_events_table()
    pprint(response, sort_dicts=False)

