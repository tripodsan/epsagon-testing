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

### Testing bundled action with helix-fetch

run:

```console
$ npm run build
$ npm run test:bundle
```

the error can be seen in the trace:

```
RangeError: Resource length mismatch (possibly incomplete body)
    at throwLengthMismatch (~/codez/helix/epsagon-testing/action-with-fetch/dist/default/epsagon-testing@1.0.2-bundle.js:4726:11)
    at StreamResponse.validateIntegrity (~/codez/helix/epsagon-testing/action-with-fetch/dist/default/epsagon-testing@1.0.2-bundle.js:4876:13)
    at awaitBuffer.then.already_1.tap.buffer (~/codez/helix/epsagon-testing/action-with-fetch/dist/default/epsagon-testing@1.0.2-bundle.js:4790:52)
    at ~/codez/helix/epsagon-testing/action-with-fetch/dist/default/epsagon-testing@1.0.2-bundle.js:1571:15
    at process._tickCallback (internal/process/next_tick.js:68:7)
```

### bundling a development version of epsagon

using `npm link` doesn't always reliably work with webpack. it is better to create a tgz:

```console
$ cd epsagon-node
$ npm run build
$ npm pack
$ cd ../epsagon-testing/action-with-fetch
$ npm add ../../epsagon-node/epsagon-0.0.0-development.tgz
``` 
