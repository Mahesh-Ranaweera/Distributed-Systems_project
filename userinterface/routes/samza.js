var request = require('request');

//start collecting data
var samzadata = [];

//start samza
function start_samza(callback){
    //start samza
    var URL = 'http://138.197.175.19:3000/start_dfs';
    
    //request to start samza
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            //add the base system reading
            samzadata.push(data.info.payload);

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

function stop_samza(callback){
    //stop samza
    var URL = 'http://138.197.175.19:3000/stop_dfs';
    
    //request to stop samza
    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            var data = JSON.parse(body);

            if(data.info.start){
                //console.log('samza stopped');
                callback(true);
            }else{
                //console.log('samza failed');
                callback(false);
            }
        }
    });
}

// //start collecting data
// var samzadata = [];
function collectSamza(){
    var URL = 'http://138.197.175.19:3000/stats_dfs';

    request.get(URL, function(err, resp, body){
        if(!err && resp.statusCode == 200){
            //convert data to json
            var data = JSON.parse(body);
            samzadata.push(data);
        }
    })
    //console.log(samzadata);
}

function samza(callback){
    //start collecting data
    var data = setInterval(collectSamza, 1000)

    setTimeout(function(){
        clearInterval(data);
        callback(samzadata);
    }, 10000)
}

module.exports.samza = samza;
module.exports.samzadata = samzadata;
module.exports.stop_samza = stop_samza;
module.exports.start_samza = start_samza;