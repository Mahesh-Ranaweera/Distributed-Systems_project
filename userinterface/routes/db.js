

//create database if not exists
module.exports = function(client){
    //create the samza tables
    client.query(`CREATE TABLE IF NOT EXISTS HADOOP(
                    id SERIAL, 
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                ); 
                CREATE TABLE IF NOT EXISTS SAMZA(
                    id SERIAL,
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS STORM(
                    id SERIAL,
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS SPARK(
                    id SERIAL, 
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS SPARK_STREAM(
                    id SERIAL, 
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS FLINK(
                    id SERIAL,
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                );
                CREATE TABLE IF NOT EXISTS FLINK_STREAM(
                    id SERIAL,
                    mem VARCHAR(50) NOT NULL, 
                    cpu VARCHAR(50) NOT NULL, 
                    PRIMARY KEY(id)
                );`, (err, res) => {
        //console.log(err, res);
        //client.end();
    });
}