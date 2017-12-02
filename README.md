# Distributed Systems project
A web-based platform for comparing Apache big data processing frameworks

## DEMO:
http://138.197.175.19:5000

## Setup instructions

Hadoop: [HadoopFiles/README.md](HadoopFiles/README.md)

Storm: [StormFiles/StormSetup.md](StormFiles/StormSetup.md)

Samza: [SamzaFiles/SamzaSetup.md](SamzaFiles/SamzaSetup.md)

Spark: [SparkFiles/README.md](SparkFiles/README.md)

Flink: [FlinkFiles/README.md](FlinkFiles/README.md)

## Server API (`exec_api`)

This is a NodeJS application that is put into each server's machine and will call the appropriate shell files when invoked.

### Prerequisites

- Install NodeJS on the server
- Run `npm install` on exec_api folder.
- Run `npm start`, and the API will run on port 3000.

## User interface (`userinterface`)

This is another NodeJS application that can run on localhost to show the test data.

The historical data will not be available for a client immediately,
as the historical data is stored in a local database when the servers run,
so if you want to see the data we used, you will need to insert the data from `stats_raw.xlsx` manually.
The application uses PostgreSQL, so you will need to insert the SQL file manually.
[For more info. please look at Data section]

### Prerequisites

- Install NodeJS on the machine that will run the site.
- Run `npm install` on `userinterface` folder to install packages.
- Run `npm start ./bin/www` and it will run on port 3000.
- Goto URL: `http://localhost:3000` on browser to test the interface.


## Data

The historical data that we use is available in the `data&graphs/stats_raw.xlsx` file.
This data was gathered over 10 runs for each server and measured CPU usage and memory usage.
Usages were polled once every second.
- Use `data&graphs/gathered_historical_data.sql` to insert historical data into the database.
