# Apache Spark setup and running

This readme outlines how we set up Spark for our testing environment.

## Installation

1. Install Spark dependencies

	Java (at time of initial setup, our version was "1.8.0_151")
	```sh
	sudo apt-get install default-jdk
	sudo apt-get install maven
	```

2. Download Spark binaries into `~/server` directory (we tested on version 1.6.3)
	```
	cd ~
	mkdir server
	cd server
	wget http://<spark download link>/spark-1.6.3-bin-hadoop2.6.tgz
	```

3. Extract the files
	```sh
	tar -xzvf spark-1.6.3-bin-hadoop2.6.tgz
	```

The tests we used for Spark's batch processing was the sample WordCount program, which counts the number of word occurrences in a given file, and can be found [here](http://www.freblogg.com/2016/06/spark-word-count-with-java.html).

The tests we used for Spark's realtime processing was ________.

## Installation

1. Install Spark dependencies

	Java (at time of initial setup, our version was "1.8.0_151")
	```sh
	sudo apt-get install default-jdk
	sudo apt-get install maven
	```

2. Download Spark binaries into `~/server` directory (we tested on version 1.6.3)
	```
	cd ~
	mkdir server
	cd server
	wget http://<spark download link>/spark-1.6.3-bin-hadoop2.6.tgz
	```

3. Extract the files
	```sh
	tar -xzvf spark-1.6.3-bin-hadoop2.6.tgz
	```


## Batch setup

Instructions can be found at [SparkFiles/batch.md](batch.md).

## Stream setup

Instructions can be found at [SparkFiles/stream.md](stream.md).
