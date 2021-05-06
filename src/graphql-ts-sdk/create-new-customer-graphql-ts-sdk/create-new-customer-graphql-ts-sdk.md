## Create a new Customer
This tutorial will show you how to create a new customer using **[commercetools Typescript SDK](https://github.com/commercetools/commercetools-sdk-typescript/)** and **[GraphQL](https://docs.commercetools.com/api/graphql)** on your commercetools project. You already finished [Getting started with TypeScript SDK and GraphQL](../getting-started-with-graphql-ts-sdk/getting-started.md) tutorials and basic project steps are not repeated here again. 

### Set up `customer.js` file
Create a new file called `customer.js` in this directory and add the following code:

```js
const { createClient } = require('@commercetools/sdk-client')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const { createApiBuilderFromCtpClient } = require("@commercetools/typescript-sdk");
  
const fetch = require('node-fetch')
require('dotenv').config()

console.log('Create a new customer using GraphQL and TypeScript SDK');
```

Nodejs dependencies are already installed as part of [Getting started with TypeScript SDK and GraphQL](../getting-started-with-graphql-ts-sdk/getting-started.md).Back at the command line, run the program using the following command:
```
$ node customer.js
Create a new customer using GraphQL and TypeScript SDK
```
If you see the same output as above, we’re ready to start.

### Create a API client
- assumption already done the getting started guide

Re-open `customer.js` and add the following code:
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
    scopes: ['<your_client_scope>'],
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
Replace the value `<your_project_key>`, `<your_auth_url>`, `<your_client_scope>` and `<your_api_url>` with your client `project_key`, `API URL`, `scope`, and `Auth URL` that you copied earlier or if you don't want to ureplace values, you can copy this code snippet from `project.js` file.

### Create GraphQL query and mutation

Add the following code to `customer.js`.
```js
// New customer data
const createCustomerMutationVariable = {
    "newCustomer": {
      "email": "your.test@test.com",
      "password": "123",
      "firstName": "yourFirstName", 
      "lastName": "yourLastName"
    }
  };

// mutation to create new customer
const createCustomerMutation = `
    mutation createCustomer ($newCustomer: CustomerSignUpDraft!) {
        customerSignUp (draft: $newCustomer) {
            customer {
                id
                email
                firstName
            }
        }
    }
`;

// GraphQL query to get Customer `email`, `firstName` and `id`
const getCustomerByIdQuery = `
    query ($id: String) {
        customer (id: $id) {
          email
          firstName
        }
    }
`;
```

`createCustomerMutationVariable` contains the new customer data and it had mandatory field `email` and `password` and optional fields `firstName` and `lastName`.Too find out list of all possible fields you can pass refer [CustomerDraft](https://docs.commercetools.com/api/projects/customers#customerdraft) documentation.
Make sure you pass unique `email` value. 

`createCustomerMutation` is the GraphQL mutation to create new customer on the commercetools project and returns `id`.

`getCustomerByIdQuery` is the GraphQL query to get newly created customer info `email` and `firstName` by `id`.

To explore commercetools GraphQL API you can use an interactive [GraphiQL environment](https://github.com/graphql/graphiql/tree/main/packages/graphiql#readme) which is available as a part of [ImpEx & API Playground](https://docs.commercetools.com/docs/login).

### Call API to create new Customer using TS SDK and Graph API

Add the following code to `customer.js`.
```js
const createNewCustomer = async () => {
    const result  = await apiRoot.withProjectKey({projectKey}).graphql().post({
        body : {
            query: CreateCustomerMutation,
            variables: createCustomerMutationVariable,
        }
    }).execute();

    // Get customerId from the result
    const {
        body: {
            data: {
                customerSignUp: {
                    customer: {
                        id:customerId
                    }
                }
            }
        }
    } = result;
    
    return customerId;
};

const getCustomerById = async (customerId) => apiRoot.withProjectKey({projectKey}).graphql().post({
        body: {
            query: customerQuery,
            variables: {
                id: customerId
            }
        }
    })
    .execute();

(async () => {
    try {
        const newlyCreatedCustomerId = await createNewCustomer();
        const newlyCreatedCustomer = await getCustomerById(newlyCreatedCustomerId);
        console.log('newly created customer info ---->', JSON.stringify(newlyCreatedCustomer));
    } catch (error) {
        console.log('ERROR --->', error);
    }
})();
```

Run the program. The output should look like the following if the request is successful:
```
$ node customer.js
Create a new customer using GraphQL and TypeScript SDK
newly created customer info ----> { 
    body: { 
        data: { 
            customer: {
                email: "your.test@test.com",
                firstName: "yourFirstName"
            }
        } 
    }, 
    statusCode: 200 
}
```


