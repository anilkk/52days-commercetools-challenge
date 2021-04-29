## Getting started
This tutorial will show you how to use the middlewares in this **[commercetools Typescript SDK](https://github.com/commercetools/commercetools-sdk-typescript/)** to get a simple commercetools Javascript app running.

### Create a API client
[Create API client](https://docs.commercetools.com/tutorials/getting-started#creating-an-api-client) from Merchant Center. If you not have account [follow the steps to create a free trail account](https://docs.commercetools.com/tutorials/getting-started#first-steps). 
In this guide we’ll be calling a method of commercetools API using Node SDK to get a commercetools project information. The commercetools API is the foundation of the commercetools Platform, and almost every commercetools client app uses it. Aside from get project information, the commercetools API allows client to call methods that can be used for everything from creating a products to updating a order’s status. Before we can call any methods, we need to configure our new app with the proper permissions.

### Getting a client credentails to use the commercetools API
From API client Details page from previous step copy  `project_key`, `API URL`, `scope` and `Auth URL`. The commercetools API uses `clientId` and `clientSecret` to authenticate the requests your app makes. In a later step, you’ll be asked to use these values in your code.

### Set up your local project
If you don’t already have a project, let’s create a new one. In an empty directory, you can initialize a new project using the following command:

```
$ npm init -y
```

After you’re done, you’ll have a new package.json file in your directory.
Install the `@commercetools/sdk-client`, `@commercetools/sdk-middleware-auth`, `@commercetools/sdk-middleware-http`, `@commercetools/api-request-builder` and `dotenv` packages and save it to your `package.json` dependencies using the following command:

```
$ npm install @commercetools/sdk-client @commercetools/sdk-middleware-auth @commercetools/sdk-middleware-http @commercetools/api-request-builder dotenv
```

Create a new file called project.js in this directory and add the following code:
```js
const { createClient } = require('@commercetools/sdk-client')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const { createApiBuilderFromCtpClient } = require("@commercetools/typescript-sdk");
  
const fetch = require('node-fetch')
require('dotenv').config()

console.log('Getting started with commercetools Typescript SDK');
```

Back at the command line, run the program using the following command:
```
$ node project.js
Getting started with commercetools Nodejs SDK
```
If you see the same output as above, we’re ready to start.

### Get commercetools project information with the commercetools API
In this guide we’ll get a project information. We’ll also follow the best practice of keeping secrets outside of your code (do not hardcode sensitive data).

Store the client id and secret in a new environment variable. Create a new file called `.env` in this directory and add the following code: 
```
ADMIN_CLIENT_ID=<your_admin_client_id>
ADMIN_CLIENT_SECRET=<your_admin_secret_id>
```
Replace the values with your client id and client sceret that you copied earlier.

Re-open project.js and add the following code:
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
const apiRoot = createApiBuilderFromCtpClient(client);

(async () => {
    try {
        await apiRoot.withProjectKey({projectKey}).get().execute()
            .then(data => {
                console.log('Project information --->', data);
            })
            .catch(error => {
                console.log('ERROR --->', error);
            })
    } catch (error) {
        console.log('ERROR --->', error);
    }
    console.log('Got project information');
})();
```
Replace the value `<your_project_key>`, `<your_auth_url>`, `<your_client_scope>` and `<your_api_url>` with your client `project_key`, `API URL`, `scope`, and `Auth URL` that you copied earlier.

This code creates a **client**, which uses `authMiddleware` and `httpMiddleware`. The `httpMiddleware` reads the `clientId` and `clientSecret` from environment variables. **apiRoot** is also created using API builder of the commercetools platform client. Then apiRoot will **execute** get project information request.

Run the program. The output should look like the following if the request is successful:
```
$ node project.js
Getting started with commercetools Typescript SDK
Project information ---> {<projectData>}
Got project information
```