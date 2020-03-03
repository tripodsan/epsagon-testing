# Epsagon Openwhisk Testing

### Create an env file

Copy the `.env.template` to `.env` and edit the `EPSAGON_TOKEN`

```console
$ cp .env.template .env
$ vi .env
```

### Setup

```console
$ npm install
```

### Testing

#### Testing with request

run:

```console
$ npm run test:request
```

This will run the action locally using the `request` module. this works and
produces a lot of debug output from `EPSAGON_DEBUG` as well as the correct
output, which is a json loaded from github.

#### Testing with helix-fetch

run:

```console
$ npm run test:fetch
```

This will run the action locally using `helix-fetch`. this produces no
output at all, which means, the response from the action is somewhere
swallowed in the openwhisk wrapper.

**Note**
- disabling epsagon, i.e. commenting out the `EPSAGON_TOKEN` shows the
correct response.

- even disabling http2 for helix-fetch doesn't help here. helix-fetch is
using fetch-h2 under the hood, which issues a APN discovery request to the host. this might be the actual problem.
