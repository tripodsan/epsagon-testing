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
require('dotenv').config();

const crypto = require('crypto');
const action = require('../dist/default/epsagon-testing@1.0.2-bundle');

async function run(mode) {
  Object.assign(process.env, {
    __OW_ACTION_NAME: '/tripod/epsagon-testing@1.0.2',
    __OW_ACTION_VERSION: '0.0.3',
    __OW_ACTIVATION_ID: crypto.randomBytes(16).toString('hex'),
    __OW_API_HOST: 'https://runtime.adobe.io',
    __OW_NAMESPACE: 'tripod',
    __OW_TRANSACTION_ID: crypto.randomBytes(16).toString('hex'),
  });

  const res = await action.main({
    EPSAGON_TOKEN: process.env.EPSAGON_TOKEN,
    MODE: mode || 'fetch',
    __ow_headers: {
      'x-request-id': crypto.randomBytes(16).toString('hex'),
    },
    __ow_method: 'get',
    __ow_path: '',
  });
  console.log(res);
}

run(process.argv[2]).catch(console.error);
