/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
// eslint-disable-next-line import/no-extraneous-dependencies
const request = require('request-promise-native');
const openwhisk = require('openwhisk');

const { wrap } = require('@adobe/helix-pingdom-status');
const { logger } = require('@adobe/openwhisk-action-builder/src/logging');

// global logger
let log;

async function test() {
  log.info('requesting "test" action".');
  const ow = openwhisk();
  const ret = await ow.actions.invoke({
    name: 'test',
    blocking: true,
  });
  log.info(`got response from ${ret.activationId}`);

  log.info('requesting "readme.md"');
  const hret = await request.get('https://raw.githubusercontent.com/adobe/helix-home/master/README.md');
  log.info(`got response ${hret.substring(0, 50)}...`);
  return {
    statusCode: 200,
    body: 'ok',
  };
}

/**
 * Runs the action by wrapping the `deliverStatic` function with the pingdom-status utility.
 * Additionally, if a EPSAGON_TOKEN is configured, the epsagon tracers are instrumented.
 * @param params Action params
 * @returns {Promise<*>} The response
 */
async function run(params) {
  let action = test;
  if (params && params.EPSAGON_TOKEN) {
    // ensure that epsagon is only required, if a token is present. this is to avoid invoking their
    // patchers otherwise.
    // eslint-disable-next-line global-require
    const { openWhiskWrapper } = require('epsagon');
    log.info('instrumenting epsagon.');
    action = openWhiskWrapper(action, {
      token_param: 'EPSAGON_TOKEN',
      appName: 'Helix Testing',
      metadataOnly: false, // Optional, send more trace data
      // api: {
      //   actions: owActions,
      // },
    });
  }
  return wrap(action, {
    github: 'https://raw.githubusercontent.com/adobe/helix-static/master/src/index.js',
  })(params);
}

/**
 * Main function called by the openwhisk invoker.
 * @param params Action params
 * @returns {Promise<*>} The response
 */
async function main(params) {
  try {
    log = logger(params, log);
    console.log = log.info.bind(log);
    console.error = log.error.bind(log);
    const result = await run(params);
    if (log.flush) {
      log.flush(); // don't wait
    }
    return result;
  } catch (e) {
    console.error(e);
    return {
      statusCode: e.statusCode || 500,
    };
  }
}

module.exports = {
  main,
};
