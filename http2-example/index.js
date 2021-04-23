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
process.env.EPSAGON_DEBUG = 'TRUE';

const epsagon = require('epsagon');
const assert = require('assert');
const fs = require('fs');
const https = require('https');
const fetchAPI = require('@adobe/helix-fetch');

epsagon.init({
  token: 'xxx',
  appName: 'Helix Test',
  metadataOnly: false,
  sendBatch: false,
});

async function test(callback) {
  const context = fetchAPI.context({
    alpnProtocols: [fetchAPI.ALPN_HTTP2],
    h2: { rejectUnauthorized: false },
    h1: { rejectUnauthorized: false },
  });
  const { fetch } = context;

  const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  };
  let count = 0;

  let server;
  await new Promise((resolve, reject) => {
    server = https.createServer(options, (req, res) => {
      console.log(count, 'request received');
      if (count === 1) {
        req.socket.destroy();
        return;
      }
      res.writeHead(200);
      res.end('hello');
      count += 1;
    }).listen(0)
      .on('error', reject)
      .on('listening', resolve);
  });

  const location = `https://localhost:${server.address().port}/`;
  try {
    const r1 = await fetch(location, { cache: 'no-store' });
    console.log('first fetch success:', r1.status, await r1.text());
  } catch (e) {
    console.error('first fetch failed', e);
  }

  try {
    const url = `https://httpbingo.org/redirect-to?url=${encodeURIComponent(location)}&status_code=302`;
    await fetch(url, { cache: 'no-store' });
    assert.fail('redirect should fail');
  } catch (e) {
    if (e.message === 'redirect should fail') {
      throw e;
    }
    console.error(e);
  } finally {
    server.close();
  }


  context.reset();
  callback();
}

const testFunction = epsagon.nodeWrapper(test);

async function run() {
  await testFunction(() => {});
}

run().catch(console.error);

