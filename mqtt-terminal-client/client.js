var brokerIp = process.env.broker || 'localhost';
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://' + brokerIp)
var exec = require('child_process').exec
var schedule = require('node-schedule')
var child, date

/* Testing Certain topic */
var json = {
	"time" : Date.now() + 10000,
	"action" : 1
};

client.on('connect',  () => {
  client.subscribe('carroautonomo')
  //client.publish('carroautonomo', JSON.stringify(json))
  client.publish('carroautonomo', "77777777")
})
 
client.on('message', (topic, message) => {
	console.log('Message', message.toString())
  var json = JSON.parse(message.toString());

  if (json.time) {
		var timer = schedule.scheduleJob(json.time, () => {
			executeProgram(json.action);
			timer.cancel();
		})
  }
})

function executeProgram(action) {
	exec('echo ' + action + ' /sys/class/gpio/gpio17/value', (error, stdout, stderr) => {
		console.log('stdout', stdout);
		console.log('stderr', stderr);
		if (error) {
			console.log('error', error);
		}
	})
}

