var mongoIp = process.env.mongo || 'localhost';
const mongoUrl =  'mongodb://' + mongoIp + ':27017/umg';
var clientShower = require('./clients/shower.js');
var clientPetFeeder = require('./clients/petFeeder.js');
var clientHomeAutomation = require('./clients/homeAutomation.js');
var mosca = require('mosca');
var mongo = require('mongodb');
var clients = [],
    mongoInstance; 

var server = new mosca.Server({
  port: 1883
});

server.on('clientConnected', (client) => {
    console.log('client connected', client.id);
});

server.on('ready', () => {
  console.log('Mosca server is up and running');
});

mongo.connect(mongoUrl, (err, db) => {
  if (err) { throw err; }
  console.log("Mongo Connection Successfull");
  mongoInstance = db;
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
          var message = clientHomeAutomation.homeAutomation(json, mongoInstance);
          if (!message) { return false; }
          publish(message, topic);        
        break;

      case 'domotica':

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
    console.log('Invalid JSON', packet.payload);
    return false;
  }
  return json;
}