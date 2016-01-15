'use strict';

app.controller('tableController', function($location,$scope, $routeParams, $http, Table, User) {
      var tableId = $routeParams.tableId;
      $scope.currentTable = null;
      $scope.tablePlayers = null;

      Table.getTable(tableId,setCurrentTable);
      function setCurrentTable(table){
            $scope.currentTable = table;
      };

      Table.getTablePlayers(tableId,setTablePlayers);
      function setTablePlayers(tablePlayers){
            $scope.tablePlayers = tablePlayers;
      };

      function addUserPlayer(returnObject){
            $scope.currentTable = returnObject[0];
            $scope.tablePlayers[Object.keys($scope.tablePlayers).length+1] = returnObject[1];
            $location.path('/player/table/'+$scope.currentTable.id);
      };

      $scope.addPlayer = function(tableId){
            User.joinTable($scope.currentTable,addUserPlayer);
      };

      $scope.switchToCasinoView = function(){
            $location.path('/casino');
      };

      $scope.deal = function(tableId){
            $scope.tablePlayers = Table.deal($scope.tablePlayers);
            var returnObject = Table.firstBets($scope.currentTable,$scope.tablePlayers,0);
            $scope.currentTable = returnObject[0];
            $scope.tablePlayers = returnObject[1];
            returnObject = Table.secondBets($scope.currentTable,$scope.tablePlayers);
            $scope.currentTable = returnObject[0];
            $scope.tablePlayers = returnObject[1];
            returnObject = Table.showDown($scope.currentTable,$scope.tablePlayers);
            $scope.currentTable = returnObject[0];
            $scope.tablePlayers = returnObject[1];
            Table.updateTablePlayers($scope.tablePlayers,resetPlayers);
      };

      $scope.notUpdatedTableScores = false; 
      
      function resetPlayers(result){
            if(result=='success'){
                  Table.getTablePlayers(tableId,setTablePlayers);
                  $scope.notUpdatedTableScores = false; 
            }else{
                  $scope.notUpdatedTableScores = true; //unwrap update button to update game scores, in case of error
            }
      };

      $scope.updateRepeat = function(){ //in case of fatal update error in Table.updateTablePlayers. Not sure how this can happen, but taing care of all cases
            if($scope.notUpdatedTableScores){
                  Table.updateTablePlayers($scope.tablePlayers,resetPlayers);
            }
      }
 });