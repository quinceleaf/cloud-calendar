import boto3


def delete_event_table(dynamodb=None):
    if not dynamodb:
        dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:8000")

    table = dynamodb.Table("Events")
    table.delete()


if __name__ == "__main__":
    delete_event_table()
    print("Events table deleted")
