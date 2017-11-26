## API for remote shell commands

### 1 Change the path of samza to system path

### 2 Start the server
```sh
npm start

or 

npm install forever -g
forever start ./bin/www
```

### Using the api
```js
//for starting the activity
http://localhost:3000/start_dfs

//for stopping the activity
http://localhost:3000/stop_dfs

//request system stats periodically
http://localhost:3000/stats_dfs
```