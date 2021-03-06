## Getting started
This tutorial will show you how to use commercetools **[Product Projection Search](https://docs.commercetools.com/api/projects/products-search)** end point using **[commercetools Typescript SDK](https://github.com/commercetools/commercetools-sdk-typescript/)**.

### Create a API client
[Create API client](https://docs.commercetools.com/tutorials/getting-started#creating-an-api-client) from Merchant Center. If you not have account [follow the steps to create a free trail account](https://docs.commercetools.com/tutorials/getting-started#first-steps). 
In this guide we’ll be calling a method of commercetools API using Node SDK to get a commercetools product information. The commercetools API is the foundation of the commercetools Platform, and almost every commercetools client app uses it. Aside from get product information, the commercetools API allows client to call methods that can be used for everything from creating a products to updating a order’s status. Before we can call any methods, we need to configure our new app with the proper permissions.


### Use Sunrise data
Import [commercetools sunrise data](https://github.com/commercetools/commercetools-sunrise-data).

### Getting a client credentials to use the commercetools API
From API client Details page from previous step download Environment variables (.env). Place it on the root of the product. 

### Set up your local product
If you don’t already have a product, let’s create a new one. In an empty directory, you can initialize a new product using the following command:

```
$ npm init -y
```

After you’re done, you’ll have a new package.json file in your directory.
Install the `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`, `@commercetools/sdk-middleware-http`, `@commercetools/typescript-sdk` and `dotenv` packages and save it to your `package.json` dependencies using the following command:

```
$ npm install @commercetools/sdk-client @commercetools/sdk-middleware-auth @commercetools/sdk-middleware-http @commercetools/typescript-sdk dotenv
```

Create a new file called `productproductionSearch.js` in this directory and add the following code:
```js
const { createClient } = require('@commercetools/sdk-client')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const { createApiBuilderFromCtpClient } = require("@commercetools/typescript-sdk");
require('dotenv').config()
const fetch = require('node-fetch')
const { 
    CTP_PROJECT_KEY,
    CTP_CLIENT_SECRET,
    CTP_CLIENT_ID,
    CTP_AUTH_URL,
    CTP_API_URL,
    CTP_SCOPES,
} = process.env

const productKey = CTP_product_KEY

// Create a httpMiddleware for the your product AUTH URL
const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: CTP_AUTH_URL,
    productKey,
    credentials: {
        clientId: CTP_CLIENT_ID,
        clientSecret: CTP_CLIENT_SECRET,
    },
    scopes: [CTP_SCOPES],
    fetch,
})

// Create a httpMiddleware for the your product API URL
const httpMiddleware = createHttpMiddleware({
    host: CTP_API_URL,
    fetch,
})

// Create a client using authMiddleware and httpMiddleware
const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
})

// Create a API root from API builder of commercetools platform client
const apiRoot = createApiBuilderFromCtpClient(client)

console.log('Getting started with commercetools Product Projection Search using Typescript SDK');
```
This code creates a **client**, which uses `authMiddleware` and `httpMiddleware`. The `httpMiddleware` reads the `clientId` and `clientSecret` from environment variables. **apiRoot** is also created using API builder of the commercetools platform client. Then apiRoot will **execute** get project information request.

Back at the command line, run the program using the following command:
```
$ node productProjectionSearch.js
Getting started with commercetools Product Projection Search using Typescript SDK
```
If you see the same output as above, we’re ready to start.

### Product Projection Search using TypeScript SDK
In this guide we’ll get full text search results of the products using Product Project Search. 

Re-open `productProjectionSearch.js` and add the following code:
```js
(async () => {
    try {
        await apiRoot.withProjectKey({projectKey})
            .productProjections()
            .search()
            .get({
                queryArgs: {
                    "text.en": "Bag Hogan brown", // Full Text search
                }
            })
            .execute()
            .then(data => {
                console.log('Product projection search result --->', data)
            })
            .catch(error => {
                console.log('ERROR --->', error)
            })
    } catch (error) {
        console.log('ERROR --->', error)
    }
})()
```

Run the program. The output should look like the following if the request is successful:
```
$ node productProjectionSearch.js
Getting started with commercetools Product Projection Search using Typescript SDK
Product production search result ---> {
  body: { limit: 20, offset: 0, count: 20, total: 2703, results: [ [Object], [Object], [Object], ... ] },
  statusCode: 200
}
```