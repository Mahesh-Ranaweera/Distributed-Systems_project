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


//start flink
function start_flink(callback){
    state = 0;
    exec('./flink start_flink', function(err, stdout){
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

//stop flink
function stop_flink(callback){
  state = 0;
  exec('./flink stop_flink', function(err, stdout){
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

//flink stream
//start flink
function start_flink_stream(callback){
  state = 0;
  exec('./flink start_flink_stream', function(err, stdout){
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

//stop flink
function stop_flink_stream(callback){
state = 0;
exec('./flink stop_flink_stream', function(err, stdout){
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
router.get('/start_flink', function(req, res, next){

  //system info before flink start::base reading
  get_stats(function(data){
    var start_data = {
      "info": {
        "start": null,
        "payload": data
      }
    };

    //start flink
    start_flink(function(started){
      //if flink started
      if(started == 1){
        start_data.info.start = true;
      }else{
        start_data.info.start = false;
      }

      //send the json output
      console.log(start_data);
      res.json(start_data);
    });
  });
});

//stop
router.get('/stop_flink', function(req, res, next){
  //system info before flink end::final reading
  get_stats(function(data){
    var end_data = {
      "info": {
        "end": null,
        "payload": data
      }
    };

    //start flink
    stop_flink(function(stopped){
      //if flink started
      if(stopped == 1){
        end_data.info.end = true;
      }else{
        end_data.info.end = false;
      }

      //send the json output
      console.log(end_data);
      res.json(end_data);
    });
  });
});


//flink stream requests
//start
router.get('/start_flink_stream', function(req, res, next){
  
    //system info before flink start::base reading
    get_stats(function(data){
      var start_data = {
        "info": {
          "start": null,
          "payload": data
        }
      };
  
      //start flink
      start_flink_stream(function(started){
        //if flink started
        if(started == 1){
          start_data.info.start = true;
        }else{
          start_data.info.start = false;
        }
  
        //send the json output
        console.log(start_data);
        res.json(start_data);
      });
    });
  });
  
//stop
router.get('/stop_flink_stream', function(req, res, next){
  //system info before flink end::final reading
  get_stats(function(data){
    var end_data = {
      "info": {
        "end": null,
        "payload": data
      }
    };

    //start flink
    stop_flink_stream(function(stopped){
      //if flink started
      if(stopped == 1){
        end_data.info.end = true;
      }else{
        end_data.info.end = false;
      }

      //send the json output
      console.log(end_data);
      res.json(end_data);
    });
  });
});


//get frequent data
router.get('/stats_dfs', function(req, res, next){
    //get system usage data
    get_stats(function(data){
      console.log(data);
      res.json(data);
    })
})

module.exports = router;
