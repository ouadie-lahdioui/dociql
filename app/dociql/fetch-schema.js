const graphql = require('graphql')
const request = require("sync-request")

const converter = require('graphql-2-json-schema');

module.exports = function (graphUrl, authHeader) {

    const requestBody = {
        operationName: "IntrospectionQuery",
        query: graphql.introspectionQuery
    };

    const headers = Object.fromEntries([authHeader.split(":")]);

    const responseBody = request("POST", graphUrl, {
        headers,
        json: requestBody
    }).getBody('utf8');

    const introspectionResponse = JSON.parse(responseBody);    

    const jsonSchema = converter.fromIntrospectionQuery(introspectionResponse.data);
    const graphQLSchema = graphql.buildClientSchema(introspectionResponse.data, { assumeValid: true});

    return {
        jsonSchema,
        graphQLSchema
    }
}
