# Flink batch setup

## Running the WordCount program

By some kind of miracle, Flink's WordCount program is the simplest to run out of all of these, since a precompiled JAR file comes in the archive.

1. Put `shakespeare.txt` into the `~/books` folder
	- If you want to use your own data, you can put whatever files you want into the books folder -- Flink will automatically parse through them all.
2. Start the Flink server, if not already running, by running `sh bin/start-local.sh` from the root of the extraced Flink archive.
3. Run the `run-batch.sh` file.

Yeah. It's really that simple. I can't believe it, either.