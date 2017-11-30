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

# Run the test (count every word in the given files)
echo 'bin/hadoop jar ~/WordCount.jar org.myorg.WordCount /books /bookoutput'
bin/hadoop jar ~/WordCount.jar org.myorg.WordCount /books /bookoutput

# Output results
echo 'bin/hdfs dfs -cat /bookoutput/*'
bin/hdfs dfs -cat /bookoutput/*
