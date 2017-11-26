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
    //console.log(err, res);
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
});

var samzadata = [];
function collectSamza(){
    var URL = 'http://138.197.175.19:3000/stats_dfs';

    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            //convert data to json
            var data = JSON.parse(body);
            samzadata.push(data);
        }
    })
    console.log(samzadata);
}

function samza_task(){
    //default data collection is every 1sec
    setInterval(collectSamza, 1000);
}

function samza_task_stop(){
    //stop the data collection
    clearInterval(collectSamza);
}


//view test memcpu graphs
router.get("/start_samza", function (req, res, next) {
    //start samza
    var URL = 'http://138.197.175.19:3000/start_dfs';

    //request to start samza
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                console.log('samza started');

                //start the collection of data
                samza_task();

                res.redirect('/');
            }else{
                console.log('samza failed');
                res.redirect('/');
            }
        }
    });
});

module.exports = router;