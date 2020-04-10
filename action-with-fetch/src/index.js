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
const { wrap } = require('@adobe/openwhisk-action-utils');
const { epsagon } = require('@adobe/helix-epsagon');
const action = require('./action');

const log = {
  info: console.log,
  error: console.error,
  debug: console.debug,
};

process.env.EPSAGON_DEBUG = 'TRUE';

async function run(params) {
  if (params && params.EPSAGON_TOKEN) {
    // eslint-disable-next-line global-require
    const { openWhiskWrapper } = require('epsagon');
    log.info('instrumenting epsagon.');
    return openWhiskWrapper(action, {
      sendTimeout: 2000,
      ignoredKeys: [/^[A-Z][A-Z0-9_]+$/, /^__ow_.*/],
      httpErrorStatusCode: 500,
      urlPatternsToIgnore: ['api.coralogix.com'],
      token_param: 'EPSAGON_TOKEN',
      appName: 'Helix Testing',
      metadataOnly: false,
      disableHttpResponseBodyCapture: true,
    })(params);
  }
  return action(params);
}

/**
 * Main function called by the openwhisk invoker.
 * @param params Action params
 * @returns {Promise<*>} The response
 */
async function main(params) {
  try {
    return await run(params);
    // return await action(params);
  } catch (e) {
    log.error(e);
    return {
      statusCode: e.statusCode || 500,
    };
  }
}
// module.exports.main = wrap(main).with(epsagon);
module.exports.main = main;
