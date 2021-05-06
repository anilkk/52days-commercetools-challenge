## How to use where clause with GraphQL query  using TypeScript SDK
This tutorial will show you how to use **where clause** with **[GraphQL query](https://docs.commercetools.com/api/graphql)** and **[commercetools Typescript SDK](https://github.com/commercetools/commercetools-sdk-typescript/)**. Assuming you already finished [Getting started with TypeScript SDK and GraphQL](../getting-started-with-graphql-ts-sdk/getting-started.md) tutorials and basic project steps are not repeated here again. 

### Set up `whereClauseQuery.js` file
Create a new file called `whereClauseQuery.js` in your project root directory and add the following code:

```js
const { createClient } = require('@commercetools/sdk-client')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const { createApiBuilderFromCtpClient } = require("@commercetools/typescript-sdk");
  
const fetch = require('node-fetch')
require('dotenv').config()

console.log('where clause query with GraphQL and TypeScript SDK');
```

Nodejs dependencies `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`,`@commercetools/sdk-middleware-http`, `@commercetools/typescript-sdk`, and `dotenv` are already installed as part of [Getting started with TypeScript SDK and GraphQL](../getting-started-with-graphql-ts-sdk/getting-started.md) tutorial. Back at the command line, run the program using the following command:
```
$ node whereClauseQuery.js
where clause query with GraphQL and TypeScript SDK
```
If you see the same output as above, we’re ready to start.

### Create an API client
You already have API client from the [Getting started with TypeScript SDK and GraphQL](../getting-started-with-graphql-ts-sdk/getting-started.md) tutorial on `project.js` file.

Re-open `whereClauseQuery.js` and add the following code:
```js
const { 
    ADMIN_CLIENT_ID,
    ADMIN_CLIENT_SECRET,
} = process.env;

const projectKey = '<your_project_key>'

// Create a httpMiddleware for the your project AUTH URL
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: '<your_auth_url>',
    projectKey,
    credentials: {
        clientId: ADMIN_CLIENT_ID,
        clientSecret: ADMIN_CLIENT_SECRET,
    },
    scopes: ['<your_client_scopes>'],
    fetch,
})

// Create a httpMiddleware for the your project API URL
const httpMiddleware = createHttpMiddleware({
    host: '<your_api_url>',
    fetch,
})

// Create a client using authMiddleware and httpMiddleware
const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
})

// Create a API root from API builder of commercetools platform client
const apiRoot = createApiBuilderFromCtpClient(client)

```
Replace the value `<your_project_key>`, `<your_auth_url>`, `<your_client_scopes>` and `<your_api_url>` with your client `projectKey`, `hostAPI_URL`, `scopes`, and `host Auth_URL` values from `project.js` file.

### Create GraphQL query and mutation
Add the following code to `whereClauseQuery.js`.

```js
// where clause with customer id
const whereClauseCustomerIdVariable = {
    "where": "id=\"<your-customer-id>\""
  };

// GraphQL query to get customer `email` and `firstName` using where clause and customer id
const getCustomerByWhereClauseQuery = `
    query ($where: String) {
        customers (where: $where) {
          email
          firstName
        }
    }
`;
```

`whereClauseCustomerIdVariable` contains where clause with value `"id=\"<your-customer-id>\""`. For details about `where` query refer [Query Predicates](https://docs.commercetools.com/api/predicates/query) documentation.

`getCustomerByWhereClauseQuery` is the GraphQL **query** to get  customer info `email` and `firstName` by where clause  and customer id.

To explore commercetools GraphQL API you can use an interactive [GraphiQL environment](https://github.com/graphql/graphiql/tree/main/packages/graphiql#readme) which is available as a part of [ImpEx & API Playground](https://docs.commercetools.com/docs/login).

### Call API to get customer information using TypeScript SDK and Graph

Add the following code to `whereClauseQuery.js`.
```js
// Get customer's email and firstName by customer id
const getCustomerByWhereClause = async () => apiRoot.withProjectKey({projectKey}).graphql().post({
        body: {
            query: getCustomerByWhereClauseQuery,
            variables: whereClauseCustomerIdVariable
        }
    })
    .execute()

(async () => {
    try {
        const result = await getCustomerByWhereClause()
        console.log('Newly created customer info ---->', JSON.stringify(result))
    } catch (error) {
        console.log('ERROR --->', error)
    }
})()
```

Run the program. The output should look like the following if the request is successful:
```
$ node whereClauseQuery.js
where clause query with GraphQL and TypeScript SDK
Newly created customer info ----> {"body":{"data":{"customer":{"email":"your.test@test.com","firstName":"yourFirstName"}}},"statusCode":200}
```


