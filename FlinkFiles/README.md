# Apache Flink setup and running

This readme outlines how we set up Flink for our testing environment.

The tests we used for Flink's batch processing was the sample WordCount program, bundled with the downloadable Flink archive.

The tests we used for Flink's realtime processing was the sample WordCount program, which listens to a port for input, and counts the words it receives.

## Installation

1. Install Flink dependencies

	Java (at time of initial setup, our version was "1.8.0_151")
	```sh
	sudo apt-get install default-jdk
	```

2. Download Flink binaries into `~/flink` directory (we tested on version 1.3.2)
	```
	cd ~
	mkdir flink
	cd flink
	wget http://<flink download link>/flink-1.3.2-bin-hadoop27-scala_2.11.tgz
	```

3. Extract the files
	```sh
	tar -xzvf flink-1.3.2-bin-hadoop27-scala_2.11.tgz
	```


## Batch setup

Instructions can be found at [FlinkFiles/batch.md](batch.md).

## Stream setup

Instructions can be found at [FlinkFiles/stream.md](stream.md).