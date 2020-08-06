from pprint import pprint
import boto3
from botocore.exceptions import ClientError


# Original tag included for check/comparison
original_tag = {
    "PK": "TAG#6194af88-a0ad-4b16-ae9b-2b1f134ded94",
    "SK": "TAG#6194af88-a0ad-4b16-ae9b-2b1f134ded94",
    "name": "Docker",
}

new_tag = {
    "PK": "TAG#6194af88-a0ad-4b16-ae9b-2b1f134ded94",
    "SK": "TAG#6194af88-a0ad-4b16-ae9b-2b1f134ded94",
    "name": "containers",
}

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"

# Parameters
# NOTE the PK/SK for this record from the sample data set in events.json
# will change with each rebuilding of the table - update the
# PK/SK as necessary to run this

# NOTE only name is a logical candidate for update/change

# TO-DO : Query and update any event-tag relations that contain updated attributes


def update_tag(tag, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")

    response = table.update_item(
        Key={"PK": tag["PK"], "SK": tag["SK"]},
        UpdateExpression="SET #name=:n",
        ExpressionAttributeValues={":n": tag["name"],},
        ExpressionAttributeNames={"#name": "name"},
        ReturnValues="ALL_NEW",
    )
    return response


if __name__ == "__main__":
    updated_tag = update_tag(new_tag)
    if updated_tag:
        print("Update tag succeeded:")
        pprint(updated_tag, sort_dicts=False)
