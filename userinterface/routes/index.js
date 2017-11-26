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
        console.log(todo);
        res.redirect('/progress');
    }else{
        res.redirect('/represent');
    }
});

router.get('/progress', function (req, res, next) {
    var len = todo.length;
    console.log("length " + len + " " + todo);

    //length = zero means jobs are done, else repeat
    //if(len != 0){
        //perform each test by going through the jobs
        for(var i=0; i < todo.length; i++){
            
            console.log(todo[i].job.method)

            if(todo[i].job.method == "batch"){
                todo.shift(i);
                return res.redirect('/schedule');
            }

            //todo.shift(i);
            //res.redirect('/schedule');

            // switch(todo[i].job.method){

            //     //case hadoop
            //     case "batch":
            //         if(todo[i].job.framework == "hadoop"){
            //             //hadoop
            //             console.log("hadoop");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }else if(todo[i].job.framework == "spark"){
            //             //spark
            //             console.log("spark");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }else{
            //             //flink 
            //             console.log("flink");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }
            //         break;
            //     case "stream":
            //         if(todo[i].job.framework == "storm"){
            //             //hadoop
            //             console.log("storm");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }else if(todo[i].job.framework == "samza"){
            //             //spark
            //             console.log("samza");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }else if(todo[i].job.framework == "spark"){
            //             //spark
            //             console.log("spark");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }else{
            //             //flink 
            //             console.log("flink");
            //             //remove the job
            //             delete todo[i];
            //             res.redirect('/progress');
            //         }
                
            //     //default:

            // }
        }

        
        // res.render('progress', {
        //     title: 'progress',
        //     jobs: todo
        // });
    // }else{
    //     res.redirect('/represent');
    // }
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