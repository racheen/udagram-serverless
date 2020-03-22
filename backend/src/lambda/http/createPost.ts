import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import * as uuid from 'uuid'
import { CreatePostRequest } from '../../requests/CreatePostRequest'
import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('createPost')

const docClient = new AWS.DynamoDB.DocumentClient()
const postTable = process.env.POSTS_TABLE
const s3BucketName = process.env.S3_BUCKET_NAME
const s3 = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Processing event: ', event);
  const postId = uuid.v4();

  const authorization = event.headers.Authorization;
  const split = authorization.split(' ');
  const jwtToken = split[1];

  const newTodo: CreatePostRequest = JSON.parse(event.body);
  const url = await generateUploadUrl(postId);

  try {
    const todoItem = {
      postId,
      userId: parseUserId(jwtToken),
      datePosted: new Date().toString(),
      attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${postId}`,
      ...newTodo
    }

    await docClient.put({
      TableName: postTable,
      Item: todoItem
    }).promise()

    return {
      statusCode: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true
      },
      body: JSON.stringify({
        item: todoItem,
        uploadUrl: url
      })
    }

  } catch (e) {
    logger.error('failed to create upload url', e);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: e
      })
    }
  }
}

async function generateUploadUrl(todoId: string): Promise<string> {
  return s3.getSignedUrl('putObject', {
    Bucket: s3BucketName,
    Key: todoId,
    Expires: 30000,
  });
}