module.exports = {
	shower : (json, mongoInstance) => {
		switch (Number(json.Accion)) {
			/* POST Apagar */
			/*
			case 0:
				return  { "Accion": 0 , "Valor": 0 };
			*/
			/* POST Encender */
			/*
			case 1:
				return  { "Accion": 1 , "Valor": json.Valor };
			*/
			/* POST Alterar */
			/*
			case 2:
				return  { "Accion": 3 , "Valor": json.Valor };
			*/
			/* GET Temperatura Actual de la regadera */
			/*
			case 3:
				return  { "Accion": 3 };
			*/
			/* GET Tiempo del Baño */
			case 4:
			  var consumo = (0.055 * (json.Valor / 3600));
			  var documento = {
			    "Fecha": new Date(),
			    "TiempoBano": json.Valor,
			    "Consumo": consumo
			  };
			  mongoInstance.collection('duracionBano').insert(documento, (err, records) => {
			    if (err) { throw err; }
			  });
			  break;

			default:
				break;
		}
	}
}