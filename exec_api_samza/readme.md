## API for remote shell commands

### 1 Change the path of samza to system path

### 2 Remove password for sudo
```sh
sudo visudo

>/etc/sudoers file

# Allow members of group sudo to execute any command
%sudo   ALL=(ALL:ALL) ALL
add line >> mi6 ALL=(ALL:ALL) NOPASSWD: ALL
            --- 
            ^ change to user

```

### 3 Add privillege to shell files
```sh
> In exec_api_samza
sudo chmod 755 samza

> In hello-samza/bin/
sudo chmod 755 grid
```

### 3 Start the server
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