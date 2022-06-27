/**
 * This Google Cloud Function will communicate with another GCF by
 * POSTing a payload to it. Once deployed, we use Auth Library to
 * create an authorized request to the sibling GCF.
 * 
 * In this example, we send a request to the sibling GCF called
 * 'proxied-web-crawler-google-cloud-function' which is waiting for
 * requests in order to crawl and extract data for this GCF. The
 * 'elements' payload specified below will cause the sibling GCF to
 * crawl the example website and wait 5 seconds to find the H1 and 
 * it's innerHTML then  return the data as the extractedText key:value pair.
 */
const functions = require('@google-cloud/functions-framework');
const axios = require('axios');
const {GoogleAuth} = require('google-auth-library');

const elements = JSON.stringify([{
  "url": "http://www.example.com/",
  // "selector": "div[id*=\"result-stats\"]",
  "selector": "h1",
  "timeout": 5000,
  "eval": "innerHTML",
  "key": "extractedText"
}]);

const initMessage = `Communicating with another Gen2 Google Cloud Function...`;

// local testing
functions.http('run-local', async (_req, res) => {
  console.log(initMessage);
  const results = await axios.post('http://localhost:8081/', { elements });
  console.log(results.data);
  res.send(results.data);
});

// prod
functions.http('run', async (_req, res) => {
  console.log(initMessage);
  const crawlerRunURL = 'https://crawler-v3j6hryt5q-wn.a.run.app';
  const auth = new GoogleAuth();
  const client = await auth.getIdTokenClient(crawlerRunURL);
  const response = await client.request({
    url: crawlerRunURL,
    method: 'POST',
    data: { elements }
  });
  console.info(response.data);
  res.send(response.data);
});
