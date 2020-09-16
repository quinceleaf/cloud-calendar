import json
import boto3
from boto3.dynamodb.conditions import Key, Attr


def consolidate_results(results):
    return_data = {"orgs": [], "tags": []}

    for record in results:
        if record["model"] == "EVENT":
            for key in record.keys():
                if key == "SK":
                    continue
                elif key == "PK":
                    return_data["id"] = record[key].split("#")[1]
                else:
                    return_data[key] = record[key]
        elif record["model"] == "ORG-RELATION":
            return_data["orgs"].append(
                {"id": record["SK"].split("#")[1], "name": record["relation_name"]}
            )
        elif record["model"] == "TAG-RELATION":
            return_data["tags"].append(
                {"id": record["SK"].split("#")[1], "name": record["relation_name"]}
            )

    return return_data


def transform_results(results):
    return_data = []

    if isinstance(results, dict):
        temp = {}
        for key, value in results.items():
            if key == "PK":
                temp["id"] = results[key].split("#")[1]
            else:
                temp[key] = results[key]
        return_data.append(temp)

    if isinstance(results, list):
        for record in results:
            temp = {}
            for key, value in record.items():
                if key == "PK":
                    temp["id"] = record[key].split("#")[1]
                else:
                    temp[key] = record[key]
            return_data.append(temp)

    return return_data


def lambda_handler(event, context):
    client = boto3.resource("dynamodb")
    table = client.Table("Events")

    response = {
        "isBase64Encoded": "false",
        "headers": {},
    }

    event_id = f"EVENT#{event['pathParameters']['id']}"

    isCollectionQuery = event.get("queryStringParameters", False) and event[
        "queryStringParameters"
    ].get("collection", False)

    if isCollectionQuery:
        results = table.query(KeyConditionExpression=Key("PK").eq(event_id),)
        conv_results = consolidate_results(results["Items"])

    else:
        results = table.get_item(
            Key={"PK": event_id, "SK": event_id},
            ProjectionExpression="PK,#name,#date,#url,description,date_added,date_updated",
            ExpressionAttributeNames={"#date": "date", "#name": "name", "#url": "url"},
        )
        conv_results = transform_results(results["Item"])

    response["statusCode"] = 200
    response["body"] = json.dumps(conv_results)

    return response