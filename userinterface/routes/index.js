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


/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index', {
        title: 'Express'
    });
});

/** global var */
var todo = [];

//schedule the tasks for running each
router.post('/sorter', function (req, res, next) {
    //get the jobs from main page
    var jobs = req.body.jobs;

    if(jobs.length != 0){
        //convert text back to json data
        todo = JSON.parse(jobs);

        //console.log(todo);
        res.redirect('/schedule');
    }else{
        //head over to index if no jobs
        res.redirect('/');
    }
});

//schedule each task assigned
router.get('/schedule', function(req, res, next){
    if(todo.length != 0){

        // res.render('progress', {
        //     title: 'progress',
        //     jobs: todo
        // });

        console.log(todo);
        res.redirect('/progress');
    }else{
        res.redirect('/represent');
    }
});

router.get('/progress', function (req, res, next) {
    var len = todo.length;
    console.log("length " + len + " " + todo);

    //perform each test by going through the jobs
    for(var i=0; i < todo.length; i++){

        switch(todo[i].job.method){

            //case hadoop
            case "batch":
                if(todo[i].job.framework == "hadoop"){
                    //hadoop
                    console.log("hadoop");
                }else if(todo[i].job.framework == "spark"){
                    //spark
                    console.log("spark");
                }else{
                    //flink 
                    console.log("flink");
                }
                break;
            case "stream":
                if(todo[i].job.framework == "storm"){
                    //hadoop
                    console.log("storm");
                    res.redirect('/progress');
                }else if(todo[i].job.framework == "samza"){
                    //spark
                    console.log("samza");
                    todo.shift(i);
                    
                    //start samza
                    start_samza(function(read){
                        if(read){
                            //if samza started start collecting data
                            console.log("Samza started");
                            samza_collect(function(collected){
                                
                                console.log(collected);
                                return res.redirect('/schedule');
                            })
                        }else{
                            //exit
                            console.log("Samza failed");
                        }
                    });
                    
                }else if(todo[i].job.framework == "spark"){
                    //spark
                    console.log("spark");
                }else{
                    //flink 
                    console.log("flink");
                }
            
            //default:

        }
        //todo.shift(i);
        //return res.redirect('/schedule');
    }
});

router.get('/represent', function (req, res, next) {
    res.render('represent', {
        title: 'data representation'
    });
});



//start samza
function start_samza(callback){
    //start samza
    var URL = 'http://138.197.175.19:3000/start_dfs';
    
    //request to start samza
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('samza started');
                callback(true);
            }else{
                //console.log('samza failed');
                callback(false);
            }
        }
    });
}


//start collecting data
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

function samza_collect(callback){
    //start collecting data
    var data = setInterval(collectSamza, 1000)

    setTimeout(function(){
        clearInterval(data);
        callback(samzadata);
    }, 10000)
}

module.exports = router;