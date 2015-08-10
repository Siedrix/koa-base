# koa-base
This is a koa/mongoose base app in the backend and a react/backbone app in the frontend. Also has some socket.io sugar.

#### Run server in dev mode

```
supervisor -i public,frontend --debug - --harmony runner.js | /usr/local/bin/bunyan
```

#### Run server in production

```
env NODE_ENV=production supervisor -i public --debug - --harmony server.js
```
To analize production logs you will need bunyan

### Frontend

To build in dev mode
```
gulp watch
```

To build for production
```
gulp build
```

### API request

Get this APIKEY and APITOKEN in the profile area.
```
curl -X POST 'http://127.0.0.1:3000/api/v1/ideas' -H 'Authorization: ApiKey <APIKEY>:<APITOKEN>' -H 'Content-Type: application/json' --data-binary '{"content":"hi"}'
```