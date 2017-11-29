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

    // db.task('getall', t => {
    //     return t.batch([
    //         t.any('SELECT * FROM samza'),
    //         t.one('SELECT * FROM hadoop'),
    //         t.one('SELECT * FROM storm'),
    //         t.one('SELECT * FROM spark'),
    //         t.one('SELECT * FROM flink')
    //     ]);
    // })
    // .then(data => {
    //     console.log(data);
    // })
    // .catch(err => {
    //     console.log(err);
    // })
    
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

    alldata = {
        'hadoop': null,
        'storm' : null,
        'samza' : null,
        'spark' : null,
        'flink' : null
    }

    //get hadoop data
    client.query(query1, (err, res) => {
        if(err){
            console.log(err);
        }else{
            console.log(res.rows);

            alldata.hadoop = res.rows;

            //get storm data
            client.query(query2, (err, res) =>{
                if(err){
                    console.log(err);
                }else{
                    console.log(res.rows);

                    alldata.storm = res.rows;

                    //get samza data
                    client.query(query3, (err, res) => {
                        if(err){
                            console.log(err);
                        }else{
                            console.log(res.rows);
                            
                            alldata.samza = res.rows;

                            //get spark data
                            client.query(query4, (err, res) => {
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log(res.rows)

                                    alldata.spark = res.rows;

                                    //get flink data
                                    client.query(query5, (err, res) => {
                                        if(err){
                                            console.log(err);
                                        }else{
                                            console.log(res.rows);

                                            alldata.flink = res.rows;

                                            callback(alldata);
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })

    //client.query(query)
    //.then(res => console.log(res.rows))
}


module.exports.addHistory = addHistory;
module.exports.getHistory = getHistory;
module.exports.getAllDB = getAllDB;