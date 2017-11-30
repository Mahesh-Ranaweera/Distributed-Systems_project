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
var completed_list = []
/** initialized database names */
const dbhadoop = 'hadoop',
dbstorm  = 'storm',
dbsamza  = 'samza',
dbspark  = 'spark',
dbflink  = 'flink',
dbspark_stream  = 'spark_stream',
dbflink_stream  = 'flink_stream';

//schedule the tasks for running each
router.post('/sorter', function (req, res, next) {
    //get the jobs from main page
    var jobs = req.body.jobs;

    if(jobs.length != 0){
        //convert text back to json data
        todo = JSON.parse(jobs);
        completed_list = JSON.parse(jobs);

        //console.log(completed_list);
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

                break;

            default:
                
        }
    }
});


//represent data for each run
router.get('/represent', function (req, res, next) {

    var completed = [];
    var links = [];

    for(var i = 0; i < completed_list.length; i++){
        var text = '['+(i+1)+'] : ';

        if(completed_list[i].job.framework == 'hadoop' && completed_list[i].job.method == 'batch'){
            text += 'Apache Hadoop - Batch';
            links.push('/history?reqdb=hadoop')
        }

        if(completed_list[i].job.framework == 'storm' && completed_list[i].job.method == 'stream'){
            text += 'Apache Storm - Stream';
            links.push('/history?reqdb=storm')
        }

        if(completed_list[i].job.framework == 'samza' && completed_list[i].job.method == 'stream'){
            text += 'Apache Samza - Stream';
            links.push('/history?reqdb=samza')
        }

        if(completed_list[i].job.framework == 'spark' && completed_list[i].job.method == 'batch'){
            text += 'Apache Spark - Batch';
            links.push('/history?reqdb=spark')
        }

        if(completed_list[i].job.framework == 'spark' && completed_list[i].job.method == 'stream'){
            text += 'Apache Spark - Stream';
            links.push('/history?reqdb=spark_stream')
        }

        if(completed_list[i].job.framework == 'flink' && completed_list[i].job.method == 'batch'){
            text += 'Apache Flink - Batch';
            links.push('/history?reqdb=flink')
        }

        if(completed_list[i].job.framework == 'flink' && completed_list[i].job.method == 'stream'){
            text += 'Apache Flink - Batch';
            links.push('/history?reqdb=flink_stream')
        }

        completed.push(text);
    }

    console.log(completed_list)
    res.render('represent', {
        title: 'data representation',
        completed: completed,
        links: links,
    });
});

//represent history of the requested bigdata 
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
        
        case 'spark_stream':
            dbdata.dbname = dbspark_stream;
            dbdata.graph_name = "Apache Spark Stream";
            break;
        
        case 'flink':
            dbdata.dbname = dbflink;
            dbdata.graph_name = "Apache Flink";
            break;
        
        case 'flink_stream':
            dbdata.dbname = dbflink_stream;
            dbdata.graph_name = "Apache Flink Stream";
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



//compare requested platform
router.post('/compare', function (req, res, next) {

    console.log(req.body.comp);

    if(req.body.comp != 0){

        //get the comparisons from main page
        var comp = JSON.parse(req.body.comp);

        var batch = false;
        var stream = false;
        var label_arr = [];
        var batch_cpu = [], batch_mem = [], stream_cpu = [], stream_mem = [];

        for(var i=0; i<32; i++){
            label_arr.push(i);
        }

        var batch_graphs = {
            batch_data: null,
        }

        var stream_graphs = {
            stream_data: null,
        }

        query.getAllDB(client, function(data){

            //only add the comparison data
            for(var i = 0; i < comp.length; i++){
        
                if(comp[i].job.framework == 'hadoop' && comp[i].job.method == 'batch'){
                    console.log('Hadoop batch')
                    batch = true;

                    var cpu = "{label: 'Apache Hadoop',"+
                    "backgroundColor: 'rgba(26, 188, 156, 0.5)',"+
                    "borderColor: 'rgba(22, 160, 133, 1)',"+
                    "data: ["+data.hadoop.cpu+"],}";

                     var mem = "{label: 'Apache Hadoop',"+
                    "backgroundColor: 'rgba(26, 188, 156, 0.5)',"+
                    "borderColor: 'rgba(22, 160, 133, 1)',"+
                    "data: ["+data.hadoop.mem+"],}";

                    batch_cpu.push(cpu);
                    batch_mem.push(mem);
                }
        
                if(comp[i].job.framework == 'storm' && comp[i].job.method == 'stream'){
                    console.log('Storm Stream')
                    stream = true;

                    var cpu = "{label: 'Apache Storm',"+
                    "backgroundColor: 'rgba(241, 196, 15, 0.5)',"+
                    "borderColor: 'rgba(243, 156, 18, 1)',"+
                    "data: ["+data.storm.cpu+"],}";

                    var mem = "{label: 'Apache Storm',"+
                    "backgroundColor: 'rgba(241, 196, 15, 0.5)',"+
                    "borderColor: 'rgba(243, 156, 18, 1)',"+
                    "data: ["+data.storm.mem+"],}";

                    stream_cpu.push(cpu);
                    stream_mem.push(mem);
                }
        
                if(comp[i].job.framework == 'samza' && comp[i].job.method == 'stream'){
                    console.log('Samza Stream')
                    stream = true;

                    var cpu = "{label: 'Apache Samza',"+
                    "backgroundColor: 'rgba(52, 152, 219, 0.5)',"+
                    "borderColor: 'rgba(41, 128, 185, 1)',"+
                    "data: ["+data.samza.cpu+"],}";

                    var mem = "{label: 'Apache Samza',"+
                    "backgroundColor: 'rgba(52, 152, 219, 0.5)',"+
                    "borderColor: 'rgba(41, 128, 185, 1)',"+
                    "data: ["+data.samza.mem+"],}";

                    stream_cpu.push(cpu);
                    stream_mem.push(mem);
                }
        
                if(comp[i].job.framework == 'spark' && comp[i].job.method == 'batch'){
                    console.log('Spark Batch')
                    batch = true;

                    var cpu = "{label: 'Apache Spark',"+
                    "backgroundColor: 'rgba(231, 76, 60, 0.5)',"+
                    "borderColor: 'rgba(192, 57, 43, 1)',"+
                    "data: ["+data.spark.cpu+"],}";

                     var mem = "{label: 'Apache Spark',"+
                    "backgroundColor: 'rgba(231, 76, 60, 0.5)',"+
                    "borderColor: 'rgba(192, 57, 43, 1)',"+
                    "data: ["+data.spark.mem+"],}";

                    batch_cpu.push(cpu);
                    batch_mem.push(mem);
                }
        
                if(comp[i].job.framework == 'spark' && comp[i].job.method == 'stream'){
                    console.log('Spark Stream')
                    stream = true;

                    var cpu = "{label: 'Apache Spark_stream',"+
                    "backgroundColor: 'rgba(155, 89, 182, 0.5)',"+
                    "borderColor: 'rgba(142, 68, 173, 1)',"+
                    "data: ["+data.spark_stream.cpu+"],}";

                    var mem = "{label: 'Apache Spark_stream',"+
                    "backgroundColor: 'rgba(155, 89, 182, 0.5)',"+
                    "borderColor: 'rgba(142, 68, 173, 1)',"+
                    "data: ["+data.spark_stream.mem+"],}";

                    stream_cpu.push(cpu);
                    stream_mem.push(mem);
                }
        
                if(comp[i].job.framework == 'flink' && comp[i].job.method == 'batch'){
                    console.log('Flink Batch')
                    batch = true;

                    var cpu = "{label: 'Apache Flink',"+
                    "backgroundColor: 'rgba(149, 165, 166, 0.5)',"+
                    "borderColor: 'rgba(127, 140, 141, 1)',"+
                    "data: ["+data.flink.cpu+"],}";

                     var mem = "{label: 'Apache Flink',"+
                    "backgroundColor: 'rgba(149, 165, 166, 0.5)',"+
                    "borderColor: 'rgba(127, 140, 141, 1)',"+
                    "data: ["+data.flink.mem+"],}";

                    batch_cpu.push(cpu);
                    batch_mem.push(mem);
                }
        
                if(comp[i].job.framework == 'flink' && comp[i].job.method == 'stream'){
                    console.log('Flink Stream')
                    stream = true;

                    var cpu = "{label: 'Apache Flink_stream',"+
                    "backgroundColor: 'rgba(52, 73, 94, 0.5)',"+
                    "borderColor: 'rgba(44, 62, 80, 1)',"+
                    "data: ["+data.flink_stream.cpu+"],}";

                    var mem = "{label: 'Apache Flink',"+
                    "backgroundColor: 'rgba(52, 73, 94, 0.5)',"+
                    "borderColor: 'rgba(44, 62, 80, 1)',"+
                    "data: ["+data.flink_stream.mem+"],}";

                    stream_cpu.push(cpu);
                    stream_mem.push(mem);
                }
            }

            //console.log(stream_mem)

            res.render('compare', {
                title: 'History Comparison',
                batch: batch,
                stream: stream,
                graph_labels: label_arr,
                batch_cpu: batch_cpu,
                batch_mem: batch_mem,
                stream_cpu: stream_cpu,
                stream_mem: stream_mem,
            });
        });
    }else{
        res.redirect('/');
    }
});


module.exports = router;