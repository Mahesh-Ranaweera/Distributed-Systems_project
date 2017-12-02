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


//start spark
function start_spark(callback){
    state = 0;
    exec('./spark start_spark', function(err, stdout){
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

//stop spark
function stop_spark(callback){
  state = 0;
  exec('./spark stop_spark', function(err, stdout){
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

//spark stream
//start spark
function start_spark_stream(callback){
  state = 0;
  exec('./spark start_spark_stream', function(err, stdout){
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

//stop spark
function stop_spark_stream(callback){
state = 0;
exec('./spark stop_spark_stream', function(err, stdout){
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
router.get('/start_spark', function(req, res, next){

  //system info before spark start::base reading
  get_stats(function(data){
    var start_data = {
      "info": {
        "start": null,
        "payload": data
      }
    };

    //start spark
    start_spark(function(started){
      //if spark started
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
router.get('/stop_spark', function(req, res, next){
  //system info before spark end::final reading
  get_stats(function(data){
    var end_data = {
      "info": {
        "end": null,
        "payload": data
      }
    };

    //start spark
    stop_spark(function(stopped){
      //if spark started
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


//spark stream requests
//start
router.get('/start_spark_stream', function(req, res, next){
  
    //system info before spark start::base reading
    get_stats(function(data){
      var start_data = {
        "info": {
          "start": null,
          "payload": data
        }
      };
  
      //start spark
      start_spark_stream(function(started){
        //if spark started
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
router.get('/stop_spark_stream', function(req, res, next){
  //system info before spark end::final reading
  get_stats(function(data){
    var end_data = {
      "info": {
        "end": null,
        "payload": data
      }
    };

    //start spark
    stop_spark_stream(function(stopped){
      //if spark started
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
