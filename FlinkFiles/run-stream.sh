rm ~/stream.txt
flink/flink-1.3.2/bin/flink run flink/flink-1.3.2/examples/streaming/WordCount.jar --input ~/books/shakespeare.txt --output ~/stream.txt