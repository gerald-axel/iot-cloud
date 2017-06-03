module.exports = {
	getData : (mongoInstance, server) => {
	  //use the find() API and pass an empty query object to retrieve all records
		mongoInstance.collection("data_history").aggregate(
			[
				{
					"$group": {
						"_id": {"hour": {"$hour": "$moment"},
						"x_location": "$x_location", "y_location": "$y_location"},
						"hour": {"$first" : {"$hour": "$moment"}},
						"x_location": {"$first":"$x_location"},
						"y_location": {"$first":"$y_location"},
						"upcars": {"$avg": {"$arrayElemAt": ["$num_cars", 0]}},
						"rightcars": {"$avg": {"$arrayElemAt": ["$num_cars", 1]}},
						"downcars": {"$avg": {"$arrayElemAt": ["$num_cars", 2]}},
						"leftcars": {"$avg": {"$arrayElemAt": ["$num_cars", 3]}}
					}
				},
				{"$sort":{x_location:1,y_location:1}},
				{"$match":{"_id.hour":(new Date()).getHours()}}
			]
		).toArray(function(err, docs){
			if ( err ) throw err;
			var mensaje = ""
			var y_location = 0
			for ( index in docs){
				var doc = docs[index];
				if (doc['y_location']!=y_location){
					mensaje += "00 ";
					y_location = doc['y_location'];
				}
				mensaje += (Math.round(doc['leftcars'])*15)+" ";
				mensaje += (Math.round(doc['rightcars'])*15)+" ";
				mensaje += (Math.round(doc['upcars'])*15)+" ";
				mensaje += (Math.round(doc['downcars'])*15)+" ";
			}
			//console.log(mensaje);
			var locaciones = "";
			var max = 4;
			var min = 0;
			for (i = 0; i < 4; i++) { 
				locaciones += (Math.floor(Math.random() * (max-min + 1) + min)) + " ";
			}
			
			mensaje = locaciones + mensaje
			publish(mensaje, 'carroautonomo', server)
		});
	}
}

function publish(info, topic, server) {
  var message = {
    topic: topic,
    payload: info, // or a Buffer
    qos: 0, // 0, 1, or 2
    retain: false // or true
  };

  server.publish(message, function() {
    console.log('Sent it!');
  });
}