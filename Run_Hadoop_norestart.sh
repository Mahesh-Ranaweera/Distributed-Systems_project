#!/bin/sh
# Clear out previous runs
bin/hadoop fs -rm -R /bookoutput

# Start the job
bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.2.jar grep /books /bookoutput 'the'

# Output the results
bin/hdfs dfs -cat /bookoutput/*
