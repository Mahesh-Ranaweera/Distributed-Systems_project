# Install JAVA
```sh
sudo add-apt-repository ppa:webupd8team/java
sudo apt-get update
sudo apt-get install oracle-java8-installer
```

# SETTING JAVA_HOME

```sh
sudo nano /etc/environment

add this two lines

JAVA_HOME=/usr/lib/jvm/java-8-oracle
JAVA8_HOME=/usr/lib/jvm/java-8-oracle

```