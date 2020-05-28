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

const fetchAPI = require('@adobe/helix-fetch');

async function request(context, error) {
  const resp = await context.fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/word2md@v1?path=%2Fdefault.md&shareLink=https%3A%2F%2Fadobe.sharepoint.com%2Fsites%2FTheBlog%2FShared%2520Documents%2Ftheblog&rid=VqNCOOblZXzBlnpLTvgG39uWoAIrGDWF&src=adobe%2Ftheblog%2Fdd25127aa92f65fda6a0927ed3fb00bf5dcea069', {
    headers: {
      accept: 'application/json',
      connection: 'close',
    }
  });
  if (error) {
    throw error;
  }
  const text = await resp.text();
  console.log(resp.status, text);
}

async function run() {
  const context = fetchAPI.context({
    http1: {
      keepAlive: false,
    },
  });
  try {
    await request(context);
    await request(context, new Error('user error'));
  } finally {
    await context.disconnectAll();
  }
}
run().catch(console.error);
