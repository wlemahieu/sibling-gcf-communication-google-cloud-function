/**
 * Example: This GCF will post a payload of desired data to
 * extract from a Google search. It will communicate with
 * the 'puppeteer-google-cloud-function' GCF repository
 * using Axios and return the extracted data!
 */
const functions = require('@google-cloud/functions-framework');
const axios = require('axios');

functions.http('run', async (_req, res) => {
  console.log(`Communicating with another Gen2 Google Cloud Function...`);

  const elements = JSON.stringify([{
    "url": "http://www.example.com/",
    // "selector": "div[id*=\"result-stats\"]",
    "selector": "h1",
    "timeout": 5000,
    "eval": "innerHTML",
    "key": "extractedText"
  }]);

  try {
    const results = await axios.post('http://localhost:8080/', { elements });
    console.log(results.data);
    res.send(results.data);
  } catch (e) {
    console.log(`Axios post failed! ${e}`);
    throw e;
  }
});
