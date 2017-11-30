# Spark batch setup

## Running the WordCount program

The WordCount program is a simple Spark program, and was created using the tutorial found [here](http://www.freblogg.com/2016/06/spark-word-count-with-java.html).

1. Put `shakespeare.txt` into the home folder
2. Create a directory in the home folder called `wordcountSrc`
3. Put these files into the `wordcountSrc` folder: `pom.xml`, `build.sh`
4. Put the `src` folder into the `wordcountSrc` folder.
	- The `WordCount.java` file expilicitly searches for a single absolute file path, which for our purposes, was `file:///home/ubuntu/shakespeare.txt`. This can be changed as desired, though using a directory of files will require some extra implementation.
5. Run `build.sh`. This will build the Maven project.
6. Place the `run-batch.sh` file into the `~/server/spark-1.6.3-bin-hadoop2.6` directory.
7. Run the `run-batch.sh` file.