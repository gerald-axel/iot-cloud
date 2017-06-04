# IOT Cloud


| Folder Directory                             | Description                                                                     |
| -------------------------------------------- | ------------------------------------------------------------                    |
|  /mosca-broker                               | Broker on NodeJs that will be in charge to distribute messages to the clients.  |   
|  /mqtt-terminal-client                       | NodeJs client that connects to the broker and creates a topic.                  |
|  /mqtt-web-client                            | Express web client with an UI on the port 3030, for testing the cloud.          |
|  /mongoData                                  | Volumes that stores the information sent it by the clients.                     |
|  /street-simulator-client                    | Python program that will simulate information for the synchronized semaphores project. |. 

### Getting Started

### 1.- Running and Building with Docker 
```
    docker-compose up --build -d
```

### 1.- Running services manually
```
    docker-compose up --build -d
```
