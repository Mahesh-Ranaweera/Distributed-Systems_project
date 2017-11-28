# Storm Setup

```sh
sudo mkdir storm
cd storm
```

## Download Zookeeper
```sh
sudo mkdir -p datadir/zookeeper
wget http://apache.mirrors.spacedump.net/zookeeper/current/zookeeper-3.4.10.tar.gz
sudo tar -xvf zookeeper-3.4.10.tar.gz
```

## Download Storm
```sh
wget http://apache.mirrors.spacedump.net/storm/apache-storm-0.9.5/apache-storm-0.9.5.tar.gz
sudo tar -xvf apache-storm-0.9.5.tar.gz
```

## Configure zookeeper
```sh
> create file
sudo nano zookeeper-3.4.10/conf/zoo.cfg
sudo nano zoo.cfg

> add following
tickTime=2000
dataDir=/home/DFS/SAMZA/storm/datadir/zookeeper
clientPort=2181
```

## Configure Storm
```sh
sudo nano apache-storm-0.9.5/conf/storm.yaml
> add following
storm.zookeeper.servers:
  - 127.0.0.1
nimbus.host: 127.0.0.1
storm.local.dir: /home/DFS/SAMZA/storm/datadir/storm
supervisor.slots.ports:
    - 6700
    - 6701
    - 6702
    - 6703
```

## Start Zookeeper, nimbus, supervisor and stormUI
```sh
sudo zookeeper-3.4.10/bin/zkServer.sh start &
sudo apache-storm-0.9.5/bin/storm nimbus &
sudo apache-storm-0.9.5/bin/storm supervisor &
sudo apache-storm-0.9.5/bin/storm ui
```

## Start Zookeeper, nimbus, supervisor and stormUI
```sh
sudo zookeeper-3.4.10/bin/zkServer.sh stop &
sudo apache-storm-0.9.5/bin/storm deactivate
```