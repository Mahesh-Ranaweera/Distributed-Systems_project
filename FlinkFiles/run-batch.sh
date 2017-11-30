# Remove previous output, if it exists
rm booksoutput.txt

# Run the WordCount program
flink/flink-1.3.2/bin/flink run -p 1 flink/flink-1.3.2/examples/batch/WordCount.jar --input ~/books --output ~/booksoutput.txt

# Print the results from the run
cat booksoutput.txt