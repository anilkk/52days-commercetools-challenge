const { createClient } = require('@commercetools/sdk-client')
const { createRequestBuilder } = require('@commercetools/api-request-builder')
const { createAuthMiddlewareForClientCredentialsFlow } = require('@commercetools/sdk-middleware-auth')
const { createHttpMiddleware } = require('@commercetools/sdk-middleware-http')
const fetch = require('node-fetch')

require('dotenv').config()

console.log('Getting started with commercetools Nodejs SDK');

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

// Create a request builder for the project
const projectService = createRequestBuilder({ projectKey }).project;

// Create a request to get project information
const createGetProjectRequest = {
    uri: projectService.build(),
    method: 'GET',
};


(async () => {
    try {
        // Use the `client.execute` method to send a message from this app
        await client.execute(createGetProjectRequest)
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