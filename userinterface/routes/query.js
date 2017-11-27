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

module.exports.addHistory = addHistory;