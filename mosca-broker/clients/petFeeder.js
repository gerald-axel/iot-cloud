module.exports = {
	petFeeder : (json, mongoInstance) => {
		switch (json.Accion) {
			/* POST  */
			case 0:
				return  { "Edad": json.Edad , "Peso": json.Peso, "Actividad": json.Actividad };
			
			/* GET */
			case 1:
			  mongoInstance.collection('petFeeder').insert(json, (err, records) => {
			    if (err) { throw err; }
			  });
				break;
				
			default:
				break;
		}
	}
}

/*
Suscribe Topic: petFeeder
{ 
	"Edad": [ "Puppy" | "Junior" | "Adult" | "Senior" ], 
	"Peso": [ 2 - 90 ], 
	"Actividad": [ "active" | "inactive" ]
}
*/