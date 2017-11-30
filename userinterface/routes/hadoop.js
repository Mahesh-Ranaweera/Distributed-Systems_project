var request = require('request');

//start collecting data
var hadoopdata = [];

//start hadoop
function start_hadoop(callback){
    //start hadoop
    var URL = 'http://138.197.174.232:3000/start_hadoop';
    
    //request to start hadoop
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            hadoopdata.push(data.info.payload);

            if(data.info.start){
                //console.log('hadoop started');
                callback(true);
            }else{
                //console.log('hadoop failed');
                callback(false);
            }
        }
    });
}

function stop_hadoop(callback){
    //stop hadoop
    var URL = 'http://138.197.174.232:3000/stop_hadoop';
    
    //request to stop hadoop
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('hadoop stopped');
                callback(true);
            }else{
                //console.log('hadoop failed');
                callback(false);
            }
        }
    });
}

// //start collecting data
// var hadoopdata = [];
function collecthadoop(){
    var URL = 'http://138.197.174.232:3000/stats_hadoop';

    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            //convert data to json
            var data = JSON.parse(body);
            hadoopdata.push(data);
        }
    })
    //console.log(hadoopdata);
}

function hadoop(callback){
    //start collecting data
    var data = setInterval(collecthadoop, 1000)

    setTimeout(function(){
        clearInterval(data);
        callback(hadoopdata);
    }, 10000)
}

module.exports.hadoop = hadoop;
module.exports.hadoopdata = hadoopdata;
module.exports.stop_hadoop = stop_hadoop;
module.exports.start_hadoop = start_hadoop;