var request = require('request');

//start collecting data
var sparkdata = [];

//start spark
function start_spark(callback){
    //start spark
    var URL = 'http://ec2-34-211-226-164.us-west-2.compute.amazonaws.com:3000/start_spark';
    
    //request to start spark
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            sparkdata.push(data.info.payload);

            if(data.info.start){
                //console.log('spark started');
                callback(true);
            }else{
                //console.log('spark failed');
                callback(false);
            }
        }
    });
}

function stop_spark(callback){
    //stop spark
    var URL = 'http://ec2-34-211-226-164.us-west-2.compute.amazonaws.com:3000/stop_spark';
    
    //request to stop spark
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('spark stopped');
                callback(true);
            }else{
                //console.log('spark failed');
                callback(false);
            }
        }
    });
}

function start_spark_stream(callback){
    //start spark
    var URL = 'http://ec2-34-211-226-164.us-west-2.compute.amazonaws.com:3000/start_spark_stream';
    
    //request to start spark
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            sparkdata.push(data.info.payload);

            if(data.info.start){
                //console.log('spark started');
                callback(true);
            }else{
                //console.log('spark failed');
                callback(false);
            }
        }
    });
}

function stop_spark_stream(callback){
    //stop spark
    var URL = 'http://ec2-34-211-226-164.us-west-2.compute.amazonaws.com:3000/stop_spark_stream';
    
    //request to stop spark
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('spark stopped');
                callback(true);
            }else{
                //console.log('spark failed');
                callback(false);
            }
        }
    });
}

// //start collecting data
// var sparkdata = [];
function collectspark(){
    var URL = 'http://ec2-34-211-226-164.us-west-2.compute.amazonaws.com:3000/stats_dfs';

    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            //convert data to json
            var data = JSON.parse(body);
            sparkdata.push(data);
        }
    })
    //console.log(sparkdata);
}

function spark(callback){
    //start collecting data
    var data = setInterval(collectspark, 1000)

    setTimeout(function(){
        clearInterval(data);
        callback(sparkdata);
    }, 10000)
}

module.exports.spark = spark;
module.exports.sparkdata = sparkdata;
module.exports.stop_spark = stop_spark;
module.exports.start_spark = start_spark;
module.exports.start_spark_stream = start_spark_stream;
module.exports.stop_spark_stream = stop_spark_stream;