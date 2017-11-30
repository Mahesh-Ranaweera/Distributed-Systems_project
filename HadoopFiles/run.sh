#!/bin/sh
# Clear out previous runs
echo 'bin/hadoop fs -rm -R /bookoutput'
bin/hadoop fs -rm -R /bookoutput

# Start the job
echo 'bin/hadoop jar ~/WordCount.jar org.myorg.WordCount /books /bookoutput'
bin/hadoop jar ~/WordCount.jar org.myorg.WordCount /books /bookoutput

# Output the results
echo 'bin/hdfs dfs -cat /bookoutput/*'
bin/hdfs dfs -cat /bookoutput/*
