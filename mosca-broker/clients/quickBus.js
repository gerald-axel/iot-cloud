module.exports = {
	quickBus : (json, mongoInstance) => {
		var datos = json.toString().split(",");
		var documento = {
			"camion": datos[0],
			"ano": datos[1],
			"mes": datos[2],
			"dia": datos[3],
			"fecha": datos[4],
			"hora": datos[5],
			"parada": datos[6],
			"longitud": datos[7],
			"latitud": datos[8],
			"pasajeros": datos[9],
			"subida": datos[10],
			"bajada": datos[11]
		};
		mongoInstance.collection('historial').insert(documento,function(err,records){
			if(err){
				throw err;
			}
		});
	}
}