# Distributed Systems project
A web-based platform for comparing Apache big data processing frameworks


## Setup instructions

Hadoop: [HadoopFiles/README.md](HadoopFiles/README.md)

Storm: [StormSetup.md](StormSetup.md)

Samza: [SamzaSetup.md](SamzaSetup.md)

Spark: [SparkFiles/README.md](SparkFiles/README.md)

Flink: [FlinkFiles/README.md](FlinkFiles/README.md)

## Server API (`exec_api_samza`)

This is a NodeJS application that is put into each server's machine and will call the appropriate shell files when invoked.

### Prerequisites

- Install NodeJS on the server
- Run `npm install`
- Run `npm start`, and the API will run on port 3000.

## User interface (`userinterface`)

This is another NodeJS application that can run on localhost to show the test data.

The historical data will not be available for a client immediately,
as the historical data is stored in a local database when the servers run,
so if you want to see the data we used, you will need to insert the data from `stats_raw.xlsx` manually.
The application uses PostgreSQL, so you will need to insert the SQL file manually.

### Prerequisites

- Install NodeJS on the machine that will run the site.
- Run `npm install`
- Run `npm run` and it will run on port 3000.


## Data

The historical data that we use is available in the `stats_raw.xlsx` file.
This data was gathered over 10 runs for each server and measured CPU usage and memory usage.
Usages were polled once every second.