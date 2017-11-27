

//create database if not exists
module.exports = function(client){
    //create the samza tables
    client.query(`CREATE TABLE IF NOT EXISTS HADOOP(
                    id SERIAL, cpu VARCHAR(10) NOT NULL, 
                    mem VARCHAR(20) NOT NULL, 
                    time VARCHAR(50), 
                    PRIMARY KEY(id)
                ); 
                CREATE TABLE IF NOT EXISTS SAMZA(
                    id SERIAL, cpu VARCHAR(10) NOT NULL, 
                    mem VARCHAR(20) NOT NULL, 
                    time VARCHAR(50), 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS STORM(
                    id SERIAL, cpu VARCHAR(10) NOT NULL, 
                    mem VARCHAR(20) NOT NULL, 
                    time VARCHAR(50), 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS SPARK(
                    id SERIAL, cpu VARCHAR(10) NOT NULL, 
                    mem VARCHAR(20) NOT NULL, 
                    time VARCHAR(50), 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS FLINK(
                    id SERIAL, cpu VARCHAR(10) NOT NULL, 
                    mem VARCHAR(20) NOT NULL, 
                    time VARCHAR(50), 
                    PRIMARY KEY(id)
                );`, (err, res) => {
        //console.log(err, res);
        client.end();
    });
}