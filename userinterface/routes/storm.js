var request = require('request');

//start collecting data
var stormdata = [];

//start storm
function start_storm(callback){
    //start storm
    var URL = 'http://138.197.175.19:3000/start_dfs';
    
    //request to start storm
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            stormdata.push(data.info.payload);

            if(data.info.start){
                //console.log('storm started');
                callback(true);
            }else{
                //console.log('storm failed');
                callback(false);
            }
        }
    });
}

function stop_storm(callback){
    //stop storm
    var URL = 'http://138.197.175.19:3000/stop_dfs';
    
    //request to stop storm
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('storm stopped');
                callback(true);
            }else{
                //console.log('storm failed');
                callback(false);
            }
        }
    });
}

// //start collecting data
// var stormdata = [];
function collectstorm(){
    var URL = 'http://138.197.175.19:3000/stats_dfs';

    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            //convert data to json
            var data = JSON.parse(body);
            stormdata.push(data);
        }
    })
    //console.log(stormdata);
}

function storm(callback){
    //start collecting data
    var data = setInterval(collectstorm, 1000)

    setTimeout(function(){
        clearInterval(data);
        callback(stormdata);
    }, 10000)
}

module.exports.storm = storm;
module.exports.stormdata = stormdata;
module.exports.stop_storm = stop_storm;
module.exports.start_storm = start_storm;