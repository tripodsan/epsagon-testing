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
const epsagon = require('epsagon');
const { fetch } = require('@adobe/helix-fetch');

epsagon.init({
  token: process.env.EPSAGON_TOKEN,
  appName: 'Helix Test',
  metadataOnly: false,
});

async function test(callback) {
  const resp = await fetch(`https://raw.githubusercontent.com/adobe/helix-shared/master/package.json`);
  console.log(resp.status);
  console.log(await resp.text());
  callback();
}

const testFunction = epsagon.nodeWrapper(test);

async function run() {
  await testFunction(() => {});
}

run().catch(console.error);

