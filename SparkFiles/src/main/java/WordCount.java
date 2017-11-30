import org.apache.spark.api.java.*;
import org.apache.spark.SparkConf;
import scala.Tuple2;
import java.util.Arrays;

public class WordCount {
	public static void main(String[] args) {

		SparkConf conf = new SparkConf().setMaster("local").setAppName("wordCount");
		JavaSparkContext sc = new JavaSparkContext(conf);

		// Load our input data.
		String inputFile = "file:///home/ubuntu/shakespeare.txt";

		JavaRDD<String> input = sc.textFile(inputFile);
		// Split in to list of words
		JavaRDD<String> words = input.flatMap(l -> Arrays.asList(l.split(" ")));

		// Transform into pairs and count.
		JavaPairRDD<String, Integer> pairs = words.mapToPair(w -> new Tuple2(w, 1));

		JavaPairRDD<String, Integer> counts = pairs.reduceByKey((x, y) -> x + y);

		System.out.println(counts.collect());
	}
}