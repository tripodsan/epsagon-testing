/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-console */
const fetchAPI = require('@adobe/helix-fetch');
const rp = require('request-promise-native');

async function testFetch() {
  // create own context and disable http2
  const context = fetchAPI.context({
    // httpProtocol: 'http1',
    // httpsProtocols: ['http1'],
  });
  try {
    // const resp = await context.fetch('https://httpbin.org/status/404', {
    // // const resp = await context.fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/word2md@v1?path=%2Fen%2Farchive%2F2020%2Fshare-like-a-boss.docx&shareLink=https%3A%2F%2Fadobe.sharepoint.com%2Fsites%2FTheBlog%2FShared%2520Documents%2Ftheblog&rid=VqNCOOblZXzBlnpLTvgG39uWoAIrGDWF&src=adobe%2Ftheblog%2Fdd25127aa92f65fda6a0927ed3fb00bf5dcea069', {
    const resp = await context.fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/word2md@v1?path=%2Fdefault.md&shareLink=https%3A%2F%2Fadobe.sharepoint.com%2Fsites%2FTheBlog%2FShared%2520Documents%2Ftheblog&rid=VqNCOOblZXzBlnpLTvgG39uWoAIrGDWF&src=adobe%2Ftheblog%2Fdd25127aa92f65fda6a0927ed3fb00bf5dcea069', {
      headers: {
        accept: 'application/json',
      }
    });
    console.log(resp.status);
    // const resp1 = await context.fetch('https://httpbin.org/status/404', {
    // const resp1 = await context.fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/word2md@v1?path=%2Fen%2Farchive%2F2020%2Fshare-like-a-boss.docx&shareLink=https%3A%2F%2Fadobe.sharepoint.com%2Fsites%2FTheBlog%2FShared%2520Documents%2Ftheblog&rid=VqNCOOblZXzBlnpLTvgG39uWoAIrGDWF&src=adobe%2Ftheblog%2Fdd25127aa92f65fda6a0927ed3fb00bf5dcea069', {
    const resp1 = await context.fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/word2md@v1?path=%2Fdefault.md&shareLink=https%3A%2F%2Fadobe.sharepoint.com%2Fsites%2FTheBlog%2FShared%2520Documents%2Ftheblog&rid=VqNCOOblZXzBlnpLTvgG39uWoAIrGDWF&src=adobe%2Ftheblog%2Fdd25127aa92f65fda6a0927ed3fb00bf5dcea069', {
      headers: {
        accept: 'application/json',
      }
    });
    console.log(resp1.status);
    const text = await resp.text();
    return {
      statusCode: 200,
      body: text,
    };
  } finally {
    await context.disconnectAll();
  }
}

async function testRequest() {
  const resp = await rp({
    url: 'https://httpbin.org/post',
    method: 'post',
    headers: {
      accept: 'application/json',
    },
    resolveWithFullResponse: true,
  });
  return {
    statusCode: resp.statusCode,
    body: resp.body,
  };
}

async function run(params) {
  // const test = testRequest;
  const test = params.MODE === 'fetch' ? testFetch : testRequest;
  console.log(`using ${params.MODE} to download content.`);
  return test(params);
}

module.exports = run;