# Epsagon Openwhisk Testing

### Create an env file

Copy the `.env.template` to `.env` and edit the `EPSAGON_TOKEN`

```
$ cp .env.template .env
$ vi .env
```

### Create the action

```
$ npm install
$ npm run build
```

### Problems

Using the current epsagon package can't load the `openwhisk` module of this module, because webpack
scopes the dynamic require in `tryRequire` with the espagons module context:


```
 tryRequire=(e,t)=>{let r;const a=t||__webpack_require__("./node_modules/epsagon/dist sync recursive")
```

