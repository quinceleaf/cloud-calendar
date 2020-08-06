from pprint import pprint
import uuid
import boto3

event_to_delete = "EVENT#52f41678-301d-4737-adbc-eb0add776508"

# Settings
LOCAL_DYNAMODB = True
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"


def delete_event(id, dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.Table("Events")
    response = table.delete_item(Key={"PK": id, "SK": id,},)

    return response


if __name__ == "__main__":
    event_response = delete_event(event_to_delete)
    print("Delete event succeeded:")
    pprint(event_response, sort_dicts=False)
