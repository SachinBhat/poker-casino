'use strict';

app.factory('User', function ($http, $location) {
	var User = {
		getUserTable: function(cameFrom){
			$http.get('/api/getUserTable').success(function (data, status) {
		      	if(status === 200 && Object.keys(data).length>0){
		      		//callBack(data.tableId);
		      		if(data.tableId!=-1) $location.path('/player/'+cameFrom+'/'+data.tableId);
		      	}else{
		      		window.alert("failed to return userTable, please refresh");
		      	}
	      	}).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		joinTable: function(table,callBack){
			$http.post('/api/joinTable',{'tableId':table.id}).success(function (data, status) {
		      	if(status === 200 && Object.keys(data).length>0){
		      		table.players[Object.keys(table.players).length+1]=data.id;
                    callBack([table,data]);
                  }else{
                        window.alert("failed to add/seat user");
                  }
	      	}).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		leaveTable: function(table,callBack){
			$http.get('/api/leaveTable').success(function(data,status){
				if(status===200 && Object.keys(data).length>0){
					for(var p in table.players){
						if(table.players[p]==data.id){
							delete table.players[p];
						}
					}
					callBack([table,data]);
				}else{
					window.alert('failed to remove/unseat user');
				}
			}).error(function(data,status){
				window.alert("error. Please try again");
			});
		}
	}
	return User;
});