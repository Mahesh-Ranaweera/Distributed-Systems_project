var express = require('express');
var router = express.Router();
var os = require('os');

//get the socket info
var http = require('http').Server(router);
var io = require('socket.io')(http);

//database initialization
const {
    Client
} = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'dfs',
    password: 'testpost',
    port: 5432,
});

client.connect();

client.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
});

/** Routing */

//get the data
var db = require('./db')(client);
var query = require('./query');

var hadoop= require('./hadoop');
var storm = require('./storm');
var samza = require('./samza');
var spark = require('./spark');
var flink = require('./flink');


/* GET home page. */
router.get('/', function (req, res, next) {

    res.render('index', {
        title: 'Express'
    });
});

/** global var */
var todo = [];
/** initialized database names */
const dbhadoop = 'hadoop',
dbstorm  = 'storm',
dbsamza  = 'samza',
dbspark  = 'spark',
dbflink  = 'flink';

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
                    todo.shift(i);
                    return res.redirect('/schedule');
                }else if(todo[i].job.framework == "spark"){
                    //spark
                    console.log("spark");
                    todo.shift(i);
                    return res.redirect('/schedule');
                }else{
                    //flink 
                    console.log("flink");
                    todo.shift(i);
                    return res.redirect('/schedule');
                }
                break;
            case "stream":
                if(todo[i].job.framework == "storm"){
                    //hadoop
                    console.log("storm");
                    todo.shift(i);
                    return res.redirect('/schedule');
                }else if(todo[i].job.framework == "samza"){
                    //spark
                    console.log("samza");
                    todo.shift(i);
                    
                    //start samza
                    samza.start_samza(function(start){
                        if(start){
                            //if samza started start collecting data
                            console.log("Samza started");
                            samza.samza(function(collected){
                                
                                //console.log(collected);

                                //add the data to db after process
                                query.addHistory(client, collected, dbsamza, function(done){
                                    //after data collection stop samza
                                    samza.stop_samza(function(stop){
                                        console.log("samza stopped");
                                        return res.redirect('/schedule');
                                    });
                                });

                                // //after data collection stop samza
                                // samza.stop_samza(function(stop){
                                //     console.log("samza stopped");
                                //     return res.redirect('/schedule');
                                // });
                            })
                        }else{
                            //exit
                            console.log("Samza failed");
                            return res.redirect('/schedule');
                        }
                    });
                    
                }else if(todo[i].job.framework == "spark"){
                    //spark
                    console.log("spark");
                    todo.shift(i);
                    return res.redirect('/schedule');
                }else{
                    //flink 
                    console.log("flink");
                    todo.shift(i);
                    return res.redirect('/schedule');
                }
        }
    }
});

router.get('/represent', function (req, res, next) {
    query.getHistory(client, dbsamza, function(data){
        console.log(data);

        var graph_labels = [];
        var graph_cpu = [];
        var graph_mem = [];
        for(var i = 0; i < data.length; i++){
            graph_labels.push(data[i][0]);
            graph_mem.push(data[i][1]);
            graph_cpu.push(data[i][2]);
        }

        console.log(graph_labels, graph_cpu, graph_mem);


        datajs = "function test(){console.log('Mahesh');} test();";

        res.render('represent', {
            title: 'data representation',
            graph_labels: graph_labels,
            graph_mem: graph_mem,
            graph_cpu: graph_cpu,
            datajs: datajs
        });
    });
});

router.get('/history', function (req, res, next) {
    var reqdb = req.query.reqdb;
    var dbdata = {
        dbname : null,
        graph_name : null
    }

    switch(reqdb){
        case 'hadoop':
            dbdata.dbname = dbhadoop;
            dbdata.graph_name = "Apache Hadoop";
            break;

        case 'storm':
            dbdata.dbname = dbstorm;
            dbdata.graph_name = "Apache Storm";
            break;
        
        case 'samza':
            dbdata.dbname = dbsamza;
            dbdata.graph_name = "Apache Samza";
            break;

        case 'spark':
            dbdata.dbname = dbspark;
            dbdata.graph_name = "Apache Spark";
            break;
        
        case 'flink':
            dbdata.dbname = dbflink;
            dbdata.graph_name = "Apache Flink";
    }

    query.getHistory(client, dbdata.dbname, function(data){
        //console.log(data);

        var graph_labels = [];
        var graph_cpu = [];
        var graph_mem = [];
        for(var i = 0; i < data.length; i++){
            graph_labels.push(data[i][0]);
            graph_mem.push(data[i][1]);
            graph_cpu.push(data[i][2]);
        }

        //console.log(graph_labels, graph_cpu, graph_mem);

        res.render('history', {
            title: dbdata.dbname + ' history',
            graph_name: dbdata.graph_name,
            graph_labels: graph_labels,
            graph_mem: graph_mem,
            graph_cpu: graph_cpu
        });
    });
});


module.exports = router;