var express = require('express');
var exec = require('child_process').exec;
var os   = require('os-utils');

var router = express.Router();

//get time in ms
//used to calculate the elapsed time
function curr_time(){
  return Math.floor(Date.now());
}

//get current spu usage
function get_stats(callback){
  data = {
    "time": null,
    "cpu": null,
    "tot_mem": null,
    "free_mem": null
  }

  os.cpuUsage(function(cpu){
    cpu = Math.round(cpu * 100);

    data = {
      "time": curr_time(),
      "cpu": cpu,
      "tot_mem": os.totalmem(),
      "free_mem": os.freemem()
    }

    callback(data);
  })
}


//start samza
function start_samza(callback){
    state = 0;
    exec('./samza start', function(err, stdout){
      if(err){
        //return the err status
        state = false;
      }else{
        state = true;
      }

      //return state 
      callback(state);
    });
}

//stop samza
function stop_samza(callback){
  state = 0;
  exec('./samza stop', function(err, stdout){
    if(err){
      //return the err status
      state = false;
    }else{
      state = true;
    }

    //return state 
    callback(state);
  });
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MainPage' });
});

//start
router.get('/start_dfs', function(req, res, next){

  //system info before samza start::base reading
  get_stats(function(data){
    var start_data = {
      "info": {
        "start": null,
        "payload": data
      }
    };

    //start samza
    start_samza(function(started){
      //if samza started
      if(started == 1){
        start_data.info.start = true;
      }else{
        start_data.info.start = false;
      }

      //send the json output
      console.log(start_data);
      res.sendStatus(start_data);
    });
  });
});

//stop
router.get('/stop_dfs', function(req, res, next){
  //system info before samza end::final reading
  get_stats(function(data){
    var end_data = {
      "info": {
        "end": null,
        "payload": data
      }
    };

    //start samza
    stop_samza(function(stopped){
      //if samza started
      if(stopped == 1){
        end_data.info.end = true;
      }else{
        end_data.info.end = false;
      }

      //send the json output
      console.log(end_data);
      res.sendStatus(end_data);
    });
  });
});

//get frequent data
router.get('/stats_dfs', function(req, res, next){
    //get system usage data
    get_stats(function(data){
      console.log(data);
      res.sendStatus(data);
    })
})

module.exports = router;
