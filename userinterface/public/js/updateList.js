//empty the options
function resetOptionsComp(id){
    var options = id.options;
    options.length = 0;
}

//update framework list:: for running testss
function updateframeworkComp(){
    var selected = document.getElementById('selectmethodcomp').value;
    var frameworks = document.getElementById('selectframeworkcomp');
    //reset the options
    resetOptionsComp(frameworks);


    //add otions
    var hadoop = document.createElement('option');
    hadoop.value = 'hadoop';
    hadoop.text  = 'Apache Hadoop';

    var storm = document.createElement('option');
    storm.value = 'storm';
    storm.text  = 'Apache Storm';

    var samza = document.createElement('option');
    samza.value = 'samza';
    samza.text  = 'Apache Samza';

    var spark = document.createElement('option');
    spark.value = 'spark';
    spark.text  = 'Apache Spark';

    var flink = document.createElement('option');
    flink.value = 'flink';
    flink.text  = 'Apache Flink';

    if(selected == "batch"){
        //console.log("batch selected")
        frameworks.add(hadoop, null);
        frameworks.add(spark, null);
        frameworks.add(flink, null);
    }else if(selected == "stream"){
        //console.log("stream selected")
        frameworks.add(storm, null);
        frameworks.add(samza, null);
        frameworks.add(spark, null);
        frameworks.add(flink, null);
    }
    //- }else if(selected == "hybrid"){
    //-     //console.log("hybrid selected")
    //-     frameworks.add(spark, null);
    //-     frameworks.add(flink, null);
    //- }
    else{
        console.log("nothing selected")
    }
}

/** global var **/
var scheduleComp = [];

//schedule the tasks for executing
function scheduledTasksComp(){
    var process = document.getElementById('selectmethodcomp').value;
    var framework = document.getElementById('selectframeworkcomp').value;

    var sch = {
        "job" : {
            "method": process,
            "framework" : framework
        }
    }

    //add the job to list
    scheduleComp.push(sch);
    
    //update the schedule list
    updateListComp();

    console.log(scheduleComp);
}

//clear the jobs
function clearListComp(){
    scheduleComp = [];
    updateListComp();

    console.log(scheduleComp);
}

//update the scheduled list dynamically
function updateListComp(){
    var scheduler = document.getElementById('scheduledtaskscomp');
    //enter the updated list into post input
    var secretjob = document.getElementById('secretinputcomp').value = JSON.stringify(scheduleComp);
    
    //empty before update
    scheduler.innerHTML = "";
    for(var i = 0; i < scheduleComp.length; i++){
        var content = "<div class='sch-test-cont'><b>Test "+ (i+1) +"</b>&nbsp&nbsp&nbsp&nbsp <b>Apache "+scheduleComp[i].job.framework+"</b> | "+scheduleComp[i].job.method+"</div>";

        //add the job to list
        scheduler.innerHTML += content;
    }
}