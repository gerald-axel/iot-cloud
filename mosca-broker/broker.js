var mongoIp = process.env.mongo || '127.0.0.1';
var mongoUrl =  'mongodb://' + mongoIp + ':27017/umg';
var clientShower = require('./clients/shower.js');
var clientPetFeeder = require('./clients/petFeeder.js');
var clientHomeAutomation = require('./clients/homeAutomation.js');
var clientAutomatedCar = require('./clients/automatedCar.js');
var mosca = require('mosca');
var mongo = require('mongodb');
var clients = [],
    mongoInstance; 

/* 
  The port 1883 is already allocated by the MQTT server
  and the 1884 will be used for the http server 
*/
var server = new mosca.Server({
  port: 1883,
  http: {
    port: 1884,
    bundle: true,
    static: './'
  }
});

server.on('clientConnected', (client) => {
    console.log('client connected', client.id);
});

server.on('clientDisconnected', (client) => {
  console.log('Client Disconnected:', client.id);
});

server.on('ready', () => {
  console.log('Mosca server is up and running');
});

mongo.connect(mongoUrl, (err, db) => {
  if (err) { throw err; }
  console.log("Mongo Connection Successfull");
  mongoInstance = db;
  timeout();
});

// fired when a message is received
server.on('published', (packet, client) => {
  console.log('Packet', packet.payload.toString());
  var json = verifyJSON(packet);
  if (!json) { return false; }

  var topic = packet.topic;
  if (topic) {
    switch (topic) {
      case 'regadera':
          var message = clientShower.shower(json, mongoInstance);
          if (!message) { return false; }
          publish(message, topic);
        break;

      case 'petFeeder':
          var message = clientPetFeeder.petFeeder(json, mongoInstance);
          if (!message) { return false; }
          publish(message, topic);        
        break;

      case 'domotica':
          var message = clientHomeAutomation.homeAutomation(json, mongoInstance);
          if (!message) { return false; }
          publish(message, topic);       
        break;      

      default:
        break;
    }
  }
});


function publish(info, topic) {
  var message = {
    topic: topic,
    payload: JSON.stringify(info), // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
  };

  server.publish(message, function() {
    console.log('Sent it!');
  });
}

function verifyJSON(packet){
  var json;
  try {
    json = JSON.parse(packet.payload.toString());
  } catch (e) {
    console.log('Invalid JSON');
    return false;
  }
  return json;
}

/* Automated Car Simulator */
function timeout() {
  setTimeout(function () {         
    // Do Something Here         
    // Then recall the parent function to         
    // create a recursive loovar todayDate = new Date()
    //client.publish('carroautonomo', 'Hello mqtt')
    //console.log('Hola');
    clientAutomatedCar.getData(mongoInstance, server);
    //console.log('Message',message);
    //publish(message, 'carroautonomo');        
    //client.publish('carroautonomo',mensaje)
    //console.log('Adios');
    timeout();     
  }, 10000); 
}