# Spark stream data setup

This test uses Spark's in-built WordCount example. This program listens on a specified port for input and counts the words it receives.

This test sends the `shakespeare.txt` file over port 9999 using netcat.

## Running the WordCount program

1. Put `shakespeare.txt` into the home folder
2. Place the `run-stream.sh` file into the `~/server/spark-1.6.3-bin-hadoop2.6` directory.
3. Run the `run-stream.sh` file.
	- This example program runs indefinitely, but the sending of data stops once it is finished. You might need to use Ctrl+C to stop the job.