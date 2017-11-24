# Flink setup

1. Install Java
```sh
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
```
2. Download and extract Flink archive to /usr/local folder
```sh
wget http://www.apache.org/dyn/closer.lua/flink/flink-1.3.2/flink-1.3.2-bin-hadoop27-scala_2.11.tgz
tar xzf flink-1.3.2-bin-hadoop27-scala_2.11.tgz
sudo mv flink-1.3.2/ /usr/local/flink
```
3. Change operating ports.
```sh
nano /usr/local/flink/conf/flink-conf.yaml

Change "jobmanager.rpc.port: 6123"
    to "jobmanager.rpc.port: 7000"

Change "jobmanager.web.port: 8081"
    to "jobmanager.web.port: 7001"
```
4. Run startup script
```sh
sh /usr/local/flink/bin/start-local.sh
```
