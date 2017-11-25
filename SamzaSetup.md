# Samza Setup


## 1 Downloading Samza
```sh
git clone https://git.apache.org/samza-hello-samza.git hello-samza
cd hello-samza

git checkout latest
```

## 2 Setting up before install
```sh
> replace /bin/grid.sh with provided grid.sh

./bin/grid boostrap
```

## 3 Building packages
```sh
./bin/deploy.sh
```

## 4 Start Samaza
```sh
> sudo ./bin/grid start all
```

## 5 Stop Samza
```sh
> sudo ./bin/grid stop all
```
