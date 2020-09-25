import boto3

# Settings
LOCAL_DYNAMODB = False
LOCAL_DYNAMODB_CONNECTION = "http://localhost:8000"
REGION = "us-east-1"


def create_event_table(dynamodb=None):
    if not dynamodb:
        if LOCAL_DYNAMODB:
            dynamodb = boto3.resource(
                "dynamodb", endpoint_url=LOCAL_DYNAMODB_CONNECTION
            )
        else:
            dynamodb = boto3.resource("dynamodb", region_name=REGION)

    table = dynamodb.create_table(
        TableName="Events",
        KeySchema=[
            {"AttributeName": "PK", "KeyType": "HASH"},  # Partition key
            {"AttributeName": "SK", "KeyType": "RANGE"},  # Sort key
        ],
        AttributeDefinitions=[
            {"AttributeName": "PK", "AttributeType": "S"},
            {"AttributeName": "SK", "AttributeType": "S"},
            {"AttributeName": "model", "AttributeType": "S"},
            {"AttributeName": "date", "AttributeType": "S"},
        ],
        ProvisionedThroughput={"ReadCapacityUnits": 2, "WriteCapacityUnits": 3},
        GlobalSecondaryIndexes=[
            {
                "IndexName": "GSI1-getEventsByDate",
                "KeySchema": [
                    {"AttributeName": "model", "KeyType": "HASH"},
                    {"AttributeName": "date", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL",},
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 2,
                    "WriteCapacityUnits": 3,
                },
            },
            {
                "IndexName": "GSI2-getObjectsByModel",
                "KeySchema": [
                    {"AttributeName": "model", "KeyType": "HASH"},
                    {"AttributeName": "PK", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL",},
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 2,
                    "WriteCapacityUnits": 3,
                },
            },
            {
                "IndexName": "GSI3-inverted",
                "KeySchema": [
                    {"AttributeName": "SK", "KeyType": "HASH"},
                    {"AttributeName": "PK", "KeyType": "RANGE"},
                ],
                "Projection": {"ProjectionType": "ALL",},
                "ProvisionedThroughput": {
                    "ReadCapacityUnits": 2,
                    "WriteCapacityUnits": 3,
                },
            },
        ],
    )

    return table


if __name__ == "__main__":
    event_table = create_event_table()
    print("Table status:", event_table.table_status)
