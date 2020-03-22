# Serverless POST

# Functionality of the application

This application will allow creating/removing/updating/fetching POST items. Each POST item can is required to have an attachment image. Each user only has access to POST items that he/she has created.

# POST items

The application should store POST items, and each POST item contains the following fields:

* `postId` (string) - a unique id for an item
* `datePosted` (string) - date and time when an item was created
* `content` (string) - content of an item (e.g. "Change a light bulb")
* `attachmentUrl` (string) - a URL pointing to an image attached to a POST item

# Implemented Functions

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetPosts` - should return all POSTs for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
    "items": [
        {
            "datePosted": "Sun Mar 22 2020 16:29:26 GMT+0000 (Coordinated Universal Time)",
            "content": "safdf",
            "postId": "17c0b261-951e-4871-a200-45e794997427",
            "attachmentUrl": "https://udacity-cloud-development-capstone-38dev.s3.amazonaws.com/17c0b261-951e-4871-a200-45e794997427",
            "userId": "auth"
        },
        {
            "content": "Hellooooo",
            "datePosted": "Sun Mar 22 2020 16:29:42 GMT+0000 (Coordinated Universal Time)",
            "postId": "671a5d29-b450-4ad0-b3ea-c0bdc069c25f",
            "attachmentUrl": "https://udacity-cloud-development-capstone-38dev.s3.amazonaws.com/671a5d29-b450-4ad0-b3ea-c0bdc069c25f",
            "userId": "auth"
        }
    ]
}
```

* `CreateTodo` - should create a new TODO for a current user. A shape of data send by a client application to this function can be found in the `CreateTodoRequest.ts` file

It receives a new POST item to be created in JSON format that looks like this:

```json
{
	"content": "Rose flowers"
}
```

It should return a new POST item that looks like this:

```json
{
    "item": {
        "postId": "e5b9e18e-8c93-470b-85e5-f467ae7d9ba5",
        "userId": "auth",
        "datePosted": "1584889350294",
        "attachmentUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png",
        "content": "Rose flowers"
    },
    "uploadUrl": "signedURL"
}
```

* `UpdatePost` - should update a POST item created by a current user. A shape of data send by a client application to this function can be found in the `UpdatePostRequest.ts` file

It receives an object that contains three fields that can be updated in a POST item:

```json
{
	"content": "Rose flowers"
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeletePost - should delete a POST item created by a current user. Expects an id of a POST item to remove.

It should return an empty body.

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = 'vmvg41581h'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-emaek-x8.auth0.com',                       // Auth0 domain
  clientId: '1VdEgtAmthjvxjcOdIxsK2fwQZsaa357',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.


## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```
# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless POST application.

# Postman collection

An alternative way to test your API, you can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")


Right click on the imported collection to set variables for the collection:

![Alt text](images/import-collection-4.png?raw=true "Image 4")

Provide variables for the collection (similarly to how this was done in the course):

![Alt text](images/import-collection-5.png?raw=true "Image 5")
