const fetch = require("node-fetch");

async function handler(event, context) {
  const { url } = event.queryStringParameters;

  const { body, httpMethod, headers } = event;

  const responseHeaders = {};
  responseHeaders["Access-Control-Allow-Origin"] = "*";
  responseHeaders["Access-Control-Allow-Methods"] =
    "POST, GET, OPTIONS, DELETE";
  responseHeaders["Access-Control-Max-Age"] = "86400";
  responseHeaders["Access-Control-Allow-Headers"] = "*";
  responseHeaders["Content-Type"] = "application/json";

  if (httpMethod === "OPTIONS") {
    const lambdaResponse = {
      statusCode: 200,
      headers: responseHeaders,
      body: "",
    };
    console.log("response", lambdaResponse);
    return lambdaResponse;
  }

  try {
    const response = await fetch(url, {
      method: httpMethod,
      body: httpMethod === "GET" ? undefined : body,
      headers: headers,
    });

    const responseJson = await response.json();

    const lambdaResponse = {
      statusCode: response.status,
      headers: responseHeaders,
      body: JSON.stringify(responseJson), // assume always json
    };
    return lambdaResponse;
  } catch (err) {
    console.error(err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: JSON.stringify(err) }),
    };
  }
}

module.exports = {
  handler,
};
