# Apache Hadoop setup and running

This readme outlines how we set up Hadoop for our testing environment.

The tests we used for Hadoop is the WordCount sample program, provided by Apache, which counts the number of word occurrences in a give dataset, and can be found [here](https://hadoop.apache.org/docs/stable/hadoop-mapreduce-client/hadoop-mapreduce-client-core/MapReduceTutorial.html).

## Machine setup
We followed DigitalOcean's install guide, found [here](https://www.digitalocean.com/community/tutorials/how-to-install-hadoop-in-stand-alone-mode-on-ubuntu-16-04).
1. Install Hadoop dependencies

	Java (at time of initial setup, our version was "1.8.0_151")
	```sh
	sudo apt-get install default-jdk
	```

2. Download Hadoop binaries (we tested on version 2.8.2)
	```
	wget http://<hadoop download link>/hadoop-2.8.2.tar.gz
	```

3. Extract and move to programs folder
	```sh
	tar -xzvf hadoop-2.8.2.tar.gz
	sudo mv hadoop-2.8.2 /usr/local/hadoop
	```

4. Set Hadoop environment variables

	Open hadoop-env.sh:
	```sh
	sudo nano /usr/local/hadoop/etc/hadoop/hadoop-env.sh
	```
	Change...
	```sh
	export JAVA_HOME=${JAVA_HOME}
	```
	...to...
	```
	export JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/jre/
	```

5. Verify install
	```sh
	/usr/local/hadoop/bin/hadoop
	```

	Output should be 
	```bash
	Usage: hadoop [--config confdir] [COMMAND | CLASSNAME]
		CLASSNAME            run the class named CLASSNAME
		or
		where COMMAND is one of:

		...
	```

## Running the WordCount program
Place the `shakespeare.txt` file into a directory called `~/books` (in the home folder). This is the directory that will be used by MapReuce to run the WordCount program.

Compile the WordCount program using Hadoop
	```
	hadoop com.sun.tools.javac.Main WordCount.java
	jar cf WordCount.jar WordCount*.class
	```
or use the precompiled place the precompiled `WordCount.jar` file into the home directory.

From there, place the `run.sh` and `onRestart_runThis.sh` files into the `/usr/local/hadoop` directory and run `sh onRestart_runThis.sh`

After that, you should be able to just run `sh run.sh` to re-run the job without having to set everything up again.

If you want to change the files that Hadoop examines, or if you reboot the machine, you'll need to re-run `sh onRestart_runThis.sh` in order to set everything up again.