var request = require('request');

//start collecting data
var flinkdata = [];

//start flink
function start_flink(callback){
    //start flink
    var URL = 'http://138.197.175.19:3000/start_dfs';
    
    //request to start flink
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            flinkdata.push(data.info.payload);

            if(data.info.start){
                //console.log('flink started');
                callback(true);
            }else{
                //console.log('flink failed');
                callback(false);
            }
        }
    });
}

function stop_flink(callback){
    //stop flink
    var URL = 'http://138.197.175.19:3000/stop_dfs';
    
    //request to stop flink
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('flink stopped');
                callback(true);
            }else{
                //console.log('flink failed');
                callback(false);
            }
        }
    });
}

function start_flink_stream(callback){
    //start flink
    var URL = 'http://138.197.175.19:3000/start_dfs';
    
    //request to start flink
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            flinkdata.push(data.info.payload);

            if(data.info.start){
                //console.log('flink started');
                callback(true);
            }else{
                //console.log('flink failed');
                callback(false);
            }
        }
    });
}

function stop_flink_stream(callback){
    //stop flink
    var URL = 'http://138.197.175.19:3000/stop_dfs';
    
    //request to stop flink
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('flink stopped');
                callback(true);
            }else{
                //console.log('flink failed');
                callback(false);
            }
        }
    });
}

// //start collecting data
// var flinkdata = [];
function collectflink(){
    var URL = 'http://138.197.175.19:3000/stats_dfs';

    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            //convert data to json
            var data = JSON.parse(body);
            flinkdata.push(data);
        }
    })
    //console.log(flinkdata);
}

function flink(callback){
    //start collecting data
    var data = setInterval(collectflink, 1000)

    setTimeout(function(){
        clearInterval(data);
        callback(flinkdata);
    }, 10000)
}

module.exports.flink = flink;
module.exports.flinkdata = flinkdata;
module.exports.stop_flink = stop_flink;
module.exports.start_flink = start_flink;
module.exports.start_flink_stream = start_flink_stream;
module.exports.stop_flink_stream = stop_flink_stream;