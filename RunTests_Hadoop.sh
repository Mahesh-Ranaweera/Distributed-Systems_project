#!/bin/sh
# Clear out any previous data we may have
echo 'sbin/stop-dfs.sh'
sbin/stop-dfs.sh
echo 'sbin/stop-yarn.sh'
sbin/stop-yarn.sh
echo 'rm -R /tmp/*'
rm -R /tmp/*
echo 'rm -rf hdfs/dn/*'
rm -rf hdfs/dn/*

# Clear out anything left over from Hadoop
echo 'bin/hdfs namenode -format -force'
bin/hdfs namenode -format -force

# Start up services
echo 'sbin/start-dfs.sh'
sbin/start-dfs.sh
echo 'sbin/start-yarn.sh'
sbin/start-yarn.sh

# Update the files to analyze in the HDFS
echo 'bin/hadoop fs -rm -R /books'
bin/hadoop fs -rm -R /books
echo 'bin/hadoop fs -rm -R /bookoutput'
bin/hadoop fs -rm -R /bookoutput

# Read in books
echo 'bin/hadoop fs -put ~/books /books'
bin/hadoop fs -put ~/books /books

# Run the test (find all instances of "the" in the given books)
echo 'bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.2.jar grep /books /bookoutput "the"'
bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.2.jar grep /books /bookoutput 'the'

# Output results
echo 'bin/hdfs dfs -cat /bookoutput/*'
bin/hdfs dfs -cat /bookoutput/*
