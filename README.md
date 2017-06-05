## IOT Cloud

### Getting Started

### 1.- Running and Building with Docker 
```
    docker-compose up --build -d
```

### 1.- Running services manually
#### a) Running broker
```
    cd mosca-broker
    npm start
```
#### b) Running mqtt-terminal-client 
```
    cd mqtt-terminal-client
    npm start
```
#### c) Running mqtt-web-client 
```
    cd mqtt-web-client
    npm start
```
#### c) Running street-simulator-client 
```
    cd street-simulator-client
    python streetSimulator.py
```
### Project Folder Structure

| Folder Directory                             | Description                                                                     |
| -------------------------------------------- | ------------------------------------------------------------                    |
|  /mosca-broker                               | Broker on NodeJs that will be in charge to distribute messages to the clients.  |   
|  /mqtt-terminal-client                       | NodeJs client that connects to the broker and creates a topic.                  |
|  /mqtt-web-client                            | Express web client with an UI on the port 3030, for testing the cloud.          |
|  /mongoData                                  | Volumes that stores the information sent it by the clients.                     |
|  /street-simulator-client                    | Python program that will simulate information for the synchronized semaphores project. |

### Clients Structure

| (/mosca-broker/clients)                      | Description                                                                     |
| -------------------------------------------- | ------------------------------------------------------------                    |
|  /automatedCar.js                            | Logic for making and answering requests for the Autonomous Car Client.          |   
|  /homeAutomation.js                          | Logic for making and answering requests for the Autonomous House Client.        |
|  /petFeeder.js                               | Logic for making and answering requests for the PetFeeder Client.               |
|  /shower.js                                  | Logic for making and answering requests for the Shower Client..                 |

### Web Client UI
![alt UI](https://github.com/gerald-axel/iot-cloud/blob/master/mqtt-web-client/public/images/web-client-dashboard.PNG)
