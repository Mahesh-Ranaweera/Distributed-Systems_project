# Flink stream data setup

## Running the WordCount program

This test uses Flink's in-built WordCount example.
This program listens on a specified port for input and counts the words it receives.
This may seem as though it's unchanged from the batch test, this version reads in the file as a live-stream in its own way.

1. Put `shakespeare.txt` into the `~/books` folder
	- If you want to use your own data, you can put whatever files you want into the books folder -- Flink will automatically parse through them all.
2. Start the Flink server, if not already running, by running `sh bin/start-local.sh` from the root of the extraced Flink archive.
3. Run the `run-stream.sh` file.