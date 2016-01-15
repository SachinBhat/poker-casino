'use strict';

app.controller('casinoController', 
	function($location,$scope, $http, Table, Casino) {
      $scope.players=null;
      $scope.tables=null;
      Casino.getAllPlayers(setPlayers);
      function setPlayers(players){
      	$scope.players = players;
      };
      Casino.getAllTables(setTables);
      function setTables(tables){
      	$scope.tables = tables;
      };
     
      $scope.addPlayer = function(userId,tableId){	
      	if(tableId<0 || tableId>2 || typeof(tableId)=='undefined'){
      		window.alert("Invalid Input");
      	}else{
			Table.addPlayer($scope.tables[tableId],$scope.players[userId],setPlayerTable);
      	}
      };

      $scope.removePlayer = function(userId,tableId){
      	Table.removePlayer($scope.tables[tableId],$scope.players[userId],setPlayerTable);
      };

      function setPlayerTable(returnObject){
      	var tableId = returnObject[0].id; 
		var userId = returnObject[1].id;
		$scope.tables[tableId] = returnObject[0];
		$scope.players[userId] = returnObject[1];
		if(userId==0){ //only for adding userPlayer, since in casinoView userPlayer cannot be unseated
			$location.path('/player/casino/'+tableId);
		}
	  };

      $scope.switchToTableView = function(tableId){
      	$location.path('/table/'+tableId);
      };
      
      $scope.deal = function(tableId){
      	Table.getTablePlayers(tableId,dealTablePlayers);
	    function dealTablePlayers(tablePlayers){ //server data change at the end of the game as this is between bots and in case of error, the game is rightfully cancelled
	      	tablePlayers = Table.deal(tablePlayers);
	      	var returnObject = Table.firstBets($scope.tables[tableId],tablePlayers,0);
	      	$scope.tables[tableId] = returnObject[0];
	      	tablePlayers = returnObject[1];
	      	returnObject = Table.secondBets($scope.tables[tableId],tablePlayers);
	      	$scope.tables[tableId] = returnObject[0];
	      	tablePlayers = returnObject[1];
	      	returnObject = Table.showDown($scope.tables[tableId],tablePlayers);
	      	$scope.tables[tableId] = returnObject[0];
	      	tablePlayers = returnObject[1];
	      	$scope.temperoryTableScores = tablePlayers; //in case of update error
	      	Table.updateTablePlayers(tablePlayers,resetPlayers); //no need to update table as all values are back to old ones.
	    };
      }

      $scope.temperoryTableScores = null;
      $scope.notUpdatedTableScores=false;

      function resetPlayers(result){
    	if(result=='success'){
    		Casino.getAllPlayers(setPlayers);
    		$scope.temperoryTableScores = null;
    		$scope.notUpdatedTableScores = false; 
    	}else{
    		$scope.temperoryTableScores = true; //unwrap update button to update game scores, in case of error
    	}
	  }

	  $scope.updateRepeat = function(){ //in case of fatal update error in Table.updateTablePlayers. Not sure how this can happen, but taing care of all cases
      	if($scope.notUpdatedTableScores){
      		Table.updateTablePlayers($scope.temperoryTableScores,resetPlayers);
      	}
      }
 	}
  );