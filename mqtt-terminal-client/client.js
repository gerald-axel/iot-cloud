var brokerIp = process.env.broker || 'localhost';
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://' + brokerIp)
var exec = require('child_process').exec
var schedule = require('node-schedule')
var child, date

/* Testing Certain topic */
var json = {
	"Accion" : 4,
	"Valor" : 5
};

client.on('connect',  () => {
  client.subscribe('regadera')
  client.publish('regadera', JSON.stringify(json))
})
 
client.on('message', (topic, message) => {
	console.log('Message', message.toString())
  var json = message.toString();

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

