'use strict';

app.factory('Casino', function ($http) {
	var Casino = {
		getAllPlayers: function(callBack){
			$http.get('/api/getAllPlayers').success(function (data, status) {
		      	if(status === 200 && Object.keys(data).length>0){
		      		callBack(data);
		      	}else{
		      		window.alert("failed to return Players, please refresh");
		      	}
	      	}).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		getAllTables: function(callBack){
			$http.get('/api/getAllTables').success(function (data, status) {
		      	if(status === 200 && Object.keys(data).length>0){
		      		callBack(data);
		      	}else{
		      		window.alert("failed to return tables, please refresh");
		      	}
	      	}).error(function(data,status){
				window.alert("error. Please try again");
			});
		}
	}
	return Casino;
});