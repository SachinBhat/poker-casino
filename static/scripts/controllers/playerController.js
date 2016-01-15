'use strict';

app.controller('playerController', function($location,$scope, $routeParams,$q, $timeout, $http, Table,User) {
      var tableId = $routeParams.tableId;
      $scope.tableId = tableId;
      $scope.cameFrom = $routeParams.cameFrom;
      $scope.user={};
      Table.getTablePlayers(tableId,setTablePlayers);
      $scope.player=null;
      function setTablePlayers(tablePlayers){
            if(Object.keys(tablePlayers).length<=0){
                  switchView();
            }else{
                  $scope.tablePlayers = tablePlayers;
                  for(var i in $scope.tablePlayers){
                        if($scope.tablePlayers[i].id==0){
                              $scope.player=$scope.tablePlayers[i];
                              break;
                        }
                  }
            }
      };

      Table.getTable(tableId,setCurrentTable); 
      function setCurrentTable(table){
            $scope.currentTable = table;
            if($scope.currentTable.currMaxBet==0){
                  $scope.dealStatus = false;
                  $scope.showDown=true;
            }else{
                  $scope.dealStatus = true;
                  $scope.showDown=false;
            }
      };
      $scope.removeUser = function(){
            if($scope.dealStatus){
                  $scope.makeFold();
            }
            User.leaveTable($scope.currentTable,setPlayerTable);       
      };

      function setPlayerTable(returnObject){
            $scope.currentTable = returnObject[0];
            $scope.player = returnObject[1];
            switchView();
      };

      function switchView(){
            if($scope.cameFrom=='casino'){
                  $location.path('/casino');
            }else{
                  $location.path('/table/'+tableId);      
            }
      };

      $scope.deal = function(){
            if($scope.currentTable.currMaxBet!=0){
                  window.alert("active game. Kindly, call or fold");
            }else{
                  $scope.currentTable.currMaxBet=5;
                  $scope.dealStatus=true;
                  $scope.showDown=false;
                  $scope.tablePlayers = Table.deal($scope.tablePlayers);
                  Table.updateTablePlayers($scope.tablePlayers,resetPlayers);
            }
      };
      $scope.makeBet = function(userBet){
            userBet=Math.floor(userBet);
            if(userBet<$scope.currentTable.minBet && $scope.player.gameCall!='fold'){
                  window.alert("bet should be more than the table minimum of 5");
            }else if(userBet>$scope.player.funds){
                  window.alert("Sorry. You dont have sufficient funds");
            }else{
                  var returnObject = Table.firstBets($scope.currentTable,$scope.tablePlayers,userBet);
                  $scope.currentTable = returnObject[0];
                  $scope.tablePlayers = returnObject[1];
                  Table.updateTablePlayers($scope.tablePlayers,resetPlayers);
                  Table.updateTable($scope.currentTable,checkTableUpdate); 
            }
      };
      $scope.makeCall = function(){
            var returnObject = Table.secondBets($scope.currentTable,$scope.tablePlayers);
            $scope.currentTable = returnObject[0];
            $scope.tablePlayers = returnObject[1];
            returnObject = Table.showDown($scope.currentTable,$scope.tablePlayers);
            $scope.currentTable = returnObject[0];
            $scope.tablePlayers = returnObject[1];
            $scope.dealStatus=false;
            $scope.showDown=true;
            Table.updateTablePlayers($scope.tablePlayers,resetPlayers);
            Table.updateTable($scope.currentTable,checkTableUpdate); 
      };

      $scope.makeFold = function(){
            for(var i in $scope.tablePlayers){
                  if($scope.tablePlayers[i].id==$scope.player.id){
                        $scope.tablePlayers[i].gameCall='fold';
                        $scope.player=$scope.tablePlayers[i];
                        break;
                  }
            }
            if($scope.currentTable.pot==0){
                  $scope.makeBet(0);
            }
            $scope.makeCall();
      }

      function checkTableUpdate(result){
            if(result=="success"){
                  $scope.notUpdatedTable = false;
            }else{
                  $scope.notUpdatedTable = true; 
            }
      }
      $scope.notUpdatedTableScores = false; 
      $scope.notUpdatedTable = false; 
      
      function resetPlayers(result){
            if(result=='success'){
                  Table.getTablePlayers(tableId,setTablePlayers);
                  $scope.notUpdatedTableScores = false; 
            }else{
                  $scope.notUpdatedTableScores = true; //unwrap update button to update game scores, in case of error
            }
      };

      $scope.updateRepeat = function(){ 
            if($scope.notUpdatedTableScores){
                  Table.updateTablePlayers($scope.tablePlayers,resetPlayers);
            }
      }

      $scope.updateTableRepeat = function(){ 
            if($scope.notUpdatedTable){
                  Table.updateTable($scope.currentTable,checkTableUpdate); 
            }
      }

 });