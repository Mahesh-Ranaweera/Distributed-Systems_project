## Setting Up Hadoop

```
https://www.digitalocean.com/community/tutorials/how-to-install-hadoop-in-stand-alone-mode-on-ubuntu-16-04
create new user for sudo

adduser sysadmin
Password: distSYS@admin

give root privilage

usermod -aG sudo sysadmin
```

```
Install java
sudo apt-get update
sudo apt-get install default-jdk

Download latest stable version
wget http://mirror.dsrg.utoronto.ca/apache/hadoop/common/hadoop-2.8.2/hadoop-2.8.2.tar.gz

Uncompress the download binary files
tar -xzvf hadoop-2.8.2.tar.gz

Move to usr/local folder
sudo mv hadoop-2.8.2 /usr/local/hadoop

Configure Hadoops Java Home
readlink -f /usr/bin/java | sed "s:bin/java::" 
    => output : /usr/lib/jvm/java-8-openjdk-amd64/jre/

sudo nano /usr/local/hadoop/etc/hadoop/hadoop-env.sh
    => Set JAVA PATH: export JAVA_HOME=$(readlink -f /usr/bin/java | sed "s:bin/java::")

Run Hadoop
/usr/local/hadoop/bin/hadoop

Setup test Map reduce
mkdir ~/HadoopInput
cp /usr/local/hadoop/etc/hadoop/*.xml ~/HadoopInput

/usr/local/hadoop/bin/hadoop jar /usr/local/hadoop/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.8.2.jar grep ~/HadoopInput ~/grep_example 'principal[.]*'

Result stored in output directory
cat ~/grep_example/*
```