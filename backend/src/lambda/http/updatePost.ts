import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS  from 'aws-sdk'
import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { parseUserId } from '../../auth/utils'
import { PostItem } from '../../models/PostItem'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoTable = process.env.TODOS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  const postId = event.pathParameters.postId
  const updatedPost: CreatePostRequest = JSON.parse(event.body)

  const todoItem = await docClient.update({
    TableName: todoTable,
    Key: {
      postId,
      userId: parseUserId(jwtToken),
    },
    UpdateExpression: "set #a = :a",
    ExpressionAttributeNames: {
      "#a": "content"
    },
    ExpressionAttributeValues: {
      ":a": updatedPost['content']
    },
    ReturnValues: "ALL_NEW"
  }).promise();

  const result = todoItem.Attributes as PostItem
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      result
    }),
  }
}
