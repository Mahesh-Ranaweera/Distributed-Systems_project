// const pgp = require('pg-promise')
// const db = pgp('postgres://postgres:testpost@host:5432/dfs')

//add collected data to db
var addHistory = function(client, upload, dbname, callback){
    //console.log(upload);

    //get the initial system cpu data:: index 0 
    var init_cpu_usage = upload[0].cpu;

    //get the initial system mem data;; index 0
    var init_mem_usage = upload[0].tot_mem - upload[0].free_mem;

    //remove initial data so its easy to manage
    upload.shift(0);

    //get the rest of the data after job
    var after_avg_mem = 0;
    var after_avg_cpu = 0;
    for(var i = 0; i < upload.length; i++){
        //console.log(upload[i].time + " " + upload[i].free_mem);
        after_avg_mem += upload[0].tot_mem - upload[0].free_mem;
        after_avg_cpu += upload[0].cpu; 
    }

    console.log("After: "+(after_avg_cpu/upload.length)+" "+(after_avg_mem/upload.length) + " Before: " + init_cpu_usage + " " + init_mem_usage);

    const query={
        text : 'INSERT INTO '+dbname+'(mem, cpu) VALUES($1, $2)',
        values : [(after_avg_mem/upload.length), (after_avg_cpu/upload.length)]
    }

    //client.connect();
    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }else{
            //console.log(res.rows[0]);
            console.log('data added to db');
            callback(true);
        }
    });
}


//get data history from db
var getHistory = function(client, dbname, callback){
    const query = {
        text : 'SELECT * FROM '+dbname,
        rowMode: 'array'
    }

    client.query(query, (err, res) => {
        if(err){
            console.log(err);
        }else{
            //console.log(res);
            callback(res.rows)
        }
    })
}

//get data from all databases
var getAllDB = function(client, callback){
    
    const query1 = {
        text : "SELECT * FROM hadoop",
        rowMode: 'array'
    }

    const query2 = {
        text : "SELECT * FROM storm",
        rowMode: 'array'
    }

    const query3 = {
        text : "SELECT * FROM samza",
        rowMode: 'array'
    }

    const query4 = {
        text : "SELECT * FROM spark",
        rowMode: 'array'
    }

    const query5 = {
        text : "SELECT * FROM flink",
        rowMode: 'array'
    }

    const query6 = {
        text : "SELECT * FROM spark_stream",
        rowMode: 'array'
    }

    const query7 = {
        text : "SELECT * FROM flink_stream",
        rowMode: 'array'
    }    

    alldata = {
        'hadoop': {
            'label': null,
            'mem': null,
            'cpu': null
        },
        'storm' : {
            'label': null,
            'mem': null,
            'cpu': null
        },
        'samza' : {
            'label': null,
            'mem': null,
            'cpu': null
        },
        'spark' : {
            'label': null,
            'mem': null,
            'cpu': null
        },
        'flink' : {
            'label': null,
            'mem': null,
            'cpu': null
        },'spark_stream' : {
            'label': null,
            'mem': null,
            'cpu': null
        },
        'flink_stream' : {
            'label': null,
            'mem': null,
            'cpu': null
        }
    }

    //var hadoop_arr, storm_arr, samza_arr, spark_arr, flink_arr = [];
    var graph_labels = [];
    var graph_cpu = [];
    var graph_mem = [];

    //get hadoop data
    client.query(query1, (err, res) => {
        if(err){
            console.log(err);
        }else{
            //console.log(res.rows);

            graph_labels = [], graph_cpu = [], graph_mem = [];

            for(var i = 0; i < res.rows.length; i++){
                graph_labels.push(res.rows[i][0]);
                graph_cpu.push(res.rows[i][1]);
                graph_mem.push(res.rows[i][2])
            }

            alldata.hadoop.label = graph_labels;
            alldata.hadoop.mem = graph_mem;
            alldata.hadoop.cpu = graph_cpu;

            //get storm data
            client.query(query2, (err, res) =>{
                if(err){
                    console.log(err);
                }else{
                    //console.log(res.rows);

                    graph_labels = [], graph_cpu = [], graph_mem = [];
                    
                    for(var i = 0; i < res.rows.length; i++){
                        graph_labels.push(res.rows[i][0]);
                        graph_cpu.push(res.rows[i][1]);
                        graph_mem.push(res.rows[i][2])
                    }
        
                    alldata.storm.label = graph_labels;
                    alldata.storm.mem = graph_mem;
                    alldata.storm.cpu = graph_cpu;

                    //get samza data
                    client.query(query3, (err, res) => {
                        if(err){
                            console.log(err);
                        }else{
                            
                            graph_labels = [], graph_cpu = [], graph_mem = [];
                            
                            for(var i = 0; i < res.rows.length; i++){
                                graph_labels.push(res.rows[i][0]);
                                graph_cpu.push(res.rows[i][1]);
                                graph_mem.push(res.rows[i][2])
                            }
                
                            alldata.samza.label = graph_labels;
                            alldata.samza.mem = graph_mem;
                            alldata.samza.cpu = graph_cpu;

                            //get spark data
                            client.query(query4, (err, res) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    //console.log(res.rows)

                                    graph_labels = [], graph_cpu = [], graph_mem = [];
                                    
                                    for(var i = 0; i < res.rows.length; i++){
                                        graph_labels.push(res.rows[i][0]);
                                        graph_cpu.push(res.rows[i][1]);
                                        graph_mem.push(res.rows[i][2])
                                    }
                        
                                    alldata.spark.label = graph_labels;
                                    alldata.spark.mem = graph_mem;
                                    alldata.spark.cpu = graph_cpu;

                                    //get flink data
                                    client.query(query5, (err, res) => {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            //console.log(res.rows);

                                            graph_labels = [], graph_cpu = [], graph_mem = [];
                                            
                                            for(var i = 0; i < res.rows.length; i++){
                                                graph_labels.push(res.rows[i][0]);
                                                graph_cpu.push(res.rows[i][1]);
                                                graph_mem.push(res.rows[i][2])
                                            }
                                
                                            alldata.flink.label = graph_labels;
                                            alldata.flink.mem = graph_mem;
                                            alldata.flink.cpu = graph_cpu;
                                            client.query(query6, (err, res) => {
                                                if(err){
                                                    console.log(err);
                                                }else{
                                                    //console.log(res.rows);
        
                                                    graph_labels = [], graph_cpu = [], graph_mem = [];
                                                    
                                                    for(var i = 0; i < res.rows.length; i++){
                                                        graph_labels.push(res.rows[i][0]);
                                                        graph_cpu.push(res.rows[i][1]);
                                                        graph_mem.push(res.rows[i][2])
                                                    }
                                        
                                                    alldata.spark_stream.label = graph_labels;
                                                    alldata.spark_stream.mem = graph_mem;
                                                    alldata.spark_stream.cpu = graph_cpu;
        
                                                    client.query(query7, (err, res) => {
                                                        if(err){
                                                            console.log(err);
                                                        }else{
                                                            //console.log(res.rows);
                
                                                            graph_labels = [], graph_cpu = [], graph_mem = [];
                                                            
                                                            for(var i = 0; i < res.rows.length; i++){
                                                                graph_labels.push(res.rows[i][0]);
                                                                graph_cpu.push(res.rows[i][1]);
                                                                graph_mem.push(res.rows[i][2])
                                                            }
                                                
                                                            alldata.flink_stream.label = graph_labels;
                                                            alldata.flink_stream.mem = graph_mem;
                                                            alldata.flink_stream.cpu = graph_cpu;
                
                                                            console.log(alldata);

                                                            callback(alldata);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });

    //client.query(query)
    //.then(res => console.log(res.rows))
}


module.exports.addHistory = addHistory;
module.exports.getHistory = getHistory;
module.exports.getAllDB = getAllDB;