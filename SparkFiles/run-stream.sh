sleep 15 | cat ~/shakespeare.txt | nc -l 9999 &

bin/run-example org.apache.spark.examples.streaming.JavaStatefulNetworkWordCount localhost 9999