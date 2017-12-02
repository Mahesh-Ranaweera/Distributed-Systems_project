# Submitting a job through YARN
(Only tested on the Hadoop droplet)

## Get an application ID
```
GET http://<server address>:<yarn port>/ws/v1/cluster/apps/new-application
```

Response should be something like this:
```json
{
  "application-id":"<app id>",
  "maximum-resource-capability":
    {
      "memory":2048,
      "vCores":4
    }
}
```

## Use the app id to submit a job

Use the <app id> from the response to submit the details of a job.
```
POST http://<server address>:<yarn port>/ws/v1/cluster/apps
```

Check the [YARN API](http://hadoop.apache.org/docs/r2.6.0/hadoop-yarn/hadoop-yarn-site/ResourceManagerRest.html#Cluster_Applications_APISubmit_Application)
for specific JSON formatting (encoding should be as "application/json").

Sample JSON:
```json
{
    "application-id":"<app id>",
    "application-name":"<app name>",
    "am-container-spec":
    {
      "commands":
      {
        "command":"{{JAVA_HOME}}/bin/java -Xmx10m org.apache.hadoop.yarn.applications.distributedshell.ApplicationMaster --container_memory 10 --container_vcores 1 --num_containers 1 --priority 0 1><LOG_DIR>/AppMaster.stdout 2><LOG_DIR>/AppMaster.stderr"
      },
      "environment":
      {
        "entry":
        [
          {
            "key": "CLASSPATH",
            "value": "{{CLASSPATH}}<CPS>./*<CPS>{{HADOOP_CONF_DIR}}<CPS>{{HADOOP_COMMON_HOME}}/share/hadoop/common/*<CPS>{{HADOOP_COMMON_HOME}}/share/hadoop/common/lib/*<CPS>{{HADOOP_HDFS_HOME}}/share/hadoop/hdfs/*<CPS>{{HADOOP_HDFS_HOME}}/share/hadoop/hdfs/lib/*<CPS>{{HADOOP_YARN_HOME}}/share/hadoop/yarn/*<CPS>{{HADOOP_YARN_HOME}}/share/hadoop/yarn/lib/*<CPS>./log4j.properties"
          }
        ]
      }
    },
    "unmanaged-AM":false,
    "max-app-attempts":2,
    "resource":
    {
      "memory":1024,
      "vCores":1
    },
    "application-type":"YARN",
    "keep-containers-across-application-attempts":false
  }
```

## Check status of submitted job
```
GET http://<server address>:<yarn port>/ws/v1/cluster/apps/<app id>/state
```

Returns job state as `NEW`, `NEW_SAVING`, `SUBMITTED`, `ACCEPTED`, `RUNNING`, `FINISHED`, `FAILED`, or `KILLED`.

## Check status of all jobs

```
GET http://<server address>:<yarn port>/ws/v1/cluster/apps
```

Returns all registered jobs on the server, including state and crash stack traces.
