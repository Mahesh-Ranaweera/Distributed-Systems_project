var express = require('express');
var router = express.Router();
var os = require('os');
var request = require('request');

//get the socket info
var http = require('http').Server(router);
var io = require('socket.io')(http);

//connect to postgre db
const {
    Client
} = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dfs',
    password: 'testpost',
    port: 5432,
})

client.connect()


client.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

//create the samza tables
client.query(`CREATE TABLE IF NOT EXISTS SAMZA(
                id SERIAL, cpu VARCHAR(10) NOT NULL, 
                mem VARCHAR(20) NOT NULL, 
                time VARCHAR(50), 
                PRIMARY KEY(id)
            ); 
            CREATE TABLE IF NOT EXISTS HADOOP(
                id SERIAL, cpu VARCHAR(10) NOT NULL, 
                mem VARCHAR(20) NOT NULL, 
                time VARCHAR(50), 
                PRIMARY KEY(id)
            );`, (err, res) => {
    console.log(err, res);
    client.end();
});


//io connect for live feed
io.on('connection', function(socket){
    console.log('connection made');
});

//connect with the hadoop server
var WebHDFS = require('webhdfs');

//create new client connection to Hadoop
var hdfs = WebHDFS.createClient({
    user: 'hduser',
    host: 'localhost',
    post: 50070 //default hadoop port
});

/* GET home page. */
router.get('/', function (req, res, next) {

    //console.log(os.cpus());
    var cpu = os.cpus();
    var mem = os.totalmem();

    res.render('index', {
        title: 'Express',
        cpu: cpu,
        mem: mem
    });
});

router.get('/progress', function (req, res, next) {
    res.render('progress', {
        title: 'progress'
    });
});

router.get('/represent', function (req, res, next) {
    res.render('represent', {
        title: 'data representation'
    });
})


var obj = null;
function dataset(){
    //var obj = null;

    var URL = 'http://138.197.175.19:3000/stats_dfs';

    setInterval(function(){
        request.get(URL, function(err, resp, body){
            if(!err && resp.statusCode == 200){
                //convert data to json
                var data = JSON.parse(body);
                //console.log(data.time);
                obj = data;
            }else{
                //res.json({"error": "error"});
                obj = null;
            }
        })
        console.log(obj);
    }, 10000);
}



//view test memcpu graphs
router.get("/graphs", function (req, res, next) {
    //start the collection of data
    dataset();
    //res.json(obj);
    res.redirect('/');
});

module.exports = router;