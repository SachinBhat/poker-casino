'use strict';

app.factory('Table', function ($q, $timeout, $http, $rootScope, $location) {
	var Table = {
		getTable: function(tableId,callBack){
			$http.post('/api/getTable',{'id':tableId}).success(function (data, status) {
                  if(status === 200 && Object.keys(data).length>0){
                        callBack(data);
                  }else{
                        window.alert("failed return tables");
                  }
            }).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		updateTable: function(table,callBack){
			$http.post('/api/updateTable',table).success(function (data, status) {
                  if(status === 200 && data.result=='success'){
                        callBack(data.result);
                  }else{
                        window.alert("failed to update table");
                  }
            }).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		getTablePlayers: function(tableId,callBack){
			$http.post('/api/getTablePlayers',{'id':tableId}).success(function (data, status) {
                  if(status === 200 && Object.keys(data).length>0){
                        callBack(data);
                  }else{
                        window.alert("No table players!!!");
                        callBack(data);
                  }
            }).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		updateTablePlayers: function(tablePlayers,callBack){
			$http.post('/api/updateTablePlayers',tablePlayers).success(function (data, status) {
				if(status===200 && data.result=='success'){
					callBack(data.result);
				}else{
					window.alert("Fatal Error. Failed to update game scores. please click update");
					callBack('failure');
				}
			}).error(function(data,status){
				window.alert("Fatal Error. Failed to update game scores. please click update");
				callBack('failure');
			});
		},
		addPlayer: function(table,player,callBack){
			$http.post('/api/addPlayer',{'tableId':table.id,'playerId':player.id}).success(function(data,status){
				if(status===200 && data.result=='success'){
					table.players[Object.keys(table.players).length+1]=player.id;
					player.table=table.id;
					player.sitting=true;
					callBack([table,player]);
				}else{
					window.alert(data.result);
				}
			}).error(function(data,status){
				window.alert("error. Please try again");
			});
		},
		removePlayer: function(table,player,callBack){ 
			$http.post('/api/removePlayer',{'tableId':table.id,'playerId':player.id}).success(function(data,status){
				if(status===200 && data.result=='success'){
					for(var p in table.players){
						if(table.players[p]==player.id){
							delete table.players[p];
						}
					}
					player.table-=1;
					player.sitting=false;
					player.lastHand="not Started";
					player.lastResult="not Started";
					player.gameCall="notFold";
					player.currentHand=[];
					player.bet=0;
					callBack([table,player]);
				}else{
					window.alert(data.result);
				}
			}).error(function(data,status){
				window.alert("error. Please try again");
			});
		}
	};

	Table.deal = function(tablePlayers){ 
		var deck = getDeck();
		var picked = new Array(52);
		for ( var i = 0; i < 52; i++ ) {
            picked[i] = 0;      //  Reset picked status of deck
        }

		for(var i=0;i<5;i++){
			for(var j in tablePlayers){
				do {
            		var n = Math.round(Math.random() * 51);  //  Pick random card
        		} while ( picked[n] == 1 );
        		picked[n] = 1;
        		tablePlayers[j].currentHand[i]=deck[n];
			}
		}
		return tablePlayers;
	};
	Table.firstBets = function(table,tablePlayers,userBet){ 
		var currMaxBet=table.minBet;
		for(var i in tablePlayers){
			var betFunds = 0;
			if(tablePlayers[i].name!='user'){ //bot logic to make bets
				var currentFunds = tablePlayers[i].funds;
				if(currentFunds<table.minBet){
					tablePlayers[i].funds=1000; //refillBalance with a buyIn(fixed at $1000)
					tablePlayers[i].buyIns+=1;
					currentFunds=1000;
					betFunds = Math.round(1000/3);
				}else if(currentFunds<table.minBet*5){
					betFunds=currentFunds;
				}else{
					betFunds = Math.max(Math.round(currentFunds/3),table.minBet*5);
				}
				var bet = Math.round(Math.random()*betFunds);
				if(bet<currMaxBet){				//playerBot folds
					tablePlayers[i].funds-=table.minBet;
					table.pot+=table.minBet;
					tablePlayers[i].gameCall='fold';
				}else{
					currMaxBet = Math.max(currMaxBet,bet);
					tablePlayers[i].funds-=bet;
					tablePlayers[i].bet=bet*-1;
					table.pot+=bet;
				}
			} //user
			else{
				if(userBet>0){ //user has not folded
					currMaxBet = Math.max(currMaxBet,userBet);
					tablePlayers[i].funds-=userBet;
					tablePlayers[i].bet=userBet*-1;
					table.pot+=userBet;
				}
			}
		}
		table.currMaxBet = currMaxBet;
		var returnObject = {};
		returnObject[0]=table;
		returnObject[1]=tablePlayers;
		return returnObject;
	};

	Table.secondBets = function(table,tablePlayers){
		var currMaxBet = table.currMaxBet;
		for(var i in tablePlayers){ //to equal everyone's bets
			if(tablePlayers[i].gameCall!='fold' && tablePlayers[i].bet!=currMaxBet*-1){
				if(tablePlayers[i].bet*-2<currMaxBet || tablePlayers[i].funds<currMaxBet){
					tablePlayers[i].gameCall='fold';
				}else{
					var bet = currMaxBet+tablePlayers[i].bet; //since bet is saved as negative number
					tablePlayers[i].funds-=bet;
					tablePlayers[i].bet-=bet;
					table.pot+=bet;
				}
			}
		}
		var returnObject = {};
		returnObject[0]=table;
		returnObject[1]=tablePlayers;
		return returnObject;
	};

	Table.showDown = function(table,tablePlayers){ 
		var winners = Table.findWinner(tablePlayers); //array of id of winning players
		var nonFoldedPlayers=0;
		for(var i in tablePlayers){
			if(tablePlayers[i].gameCall!='fold') nonFoldedPlayers+=1;
		}
		var winSum = table.pot/nonFoldedPlayers;
		for(var i in tablePlayers){
			tablePlayers[i].gameCall='notFold';
			tablePlayers[i].lastHand=tablePlayers[i].currentHand;
			if(winners.indexOf(tablePlayers[i].id)>-1){
				tablePlayers[i].funds+=winSum;
				tablePlayers[i].lastResult='won';
			}else{
				tablePlayers[i].lastResult='lost';
			}
		}
		table.currMaxBet=0;
		table.pot=0;
		var returnObject = {};
		returnObject[0]=table;
		returnObject[1]=tablePlayers;
		return returnObject;
	};

	Table.findWinner = function(tablePlayers){
		var winners=[];
		var maxCombination=0;
		for(var i in tablePlayers){
			if(tablePlayers[i].gameCall!='fold'){
				var combination=Table.handCombination(tablePlayers[i].currentHand); //get combination value of the hand
				if(combination>maxCombination){
					maxCombination=combination;
					winners=[tablePlayers[i].id];
				}else if(combination==maxCombination){
					winners.push(tablePlayers[i].id);
				}
			}
		}
		return winners;
	}

	function compare(a, b) { //  Compare function for sorting the cards
	    return a-b;
	}

	Table.handCombination = function(currentHand) { 
	    var suits = new Array(4);         //  To check for a flush
	    var matched = new Array(13);      //  To check for pairs, threes, fours
	    var pairs = 0, threes = 0, fours = 0;
	    var flush = false, straight = false;
	    var combination = 0;
	    var cardvals = [];
	    var deck=getDeck();

	    for(var i=0;i<currentHand.length;i++){
	    	cardvals.push(deck.indexOf(currentHand[i]));
	    }

	    cardvals.sort(compare);           //  Sort the cards

	    for ( var i = 0; i < 4; i++ ) {
	        suits[i] = 0;                 //  Initialise suits array to zero
	    }

	    for ( var i = 0; i < 13; i++ ) {
	        matched[i] = 0;               //  Initialise matched array to zero  
	    }

	    for ( var i = 0; i < 5; i++ ) {
	        matched[cardvals[i] % 13]++;            //  Update matched for cards
	        suits[Math.floor(cardvals[i]/13)]++;    //  Update suits for cards
	    }

	    //  Check for pairs, threes and fours

	    for ( var i = 0; i < 13; i++ ) {
	        if ( matched[i] == 2 ) {
	            pairs++;
	        }
	        else if ( matched[i] == 3 ) {
	            threes++;
	        }
	        else if ( matched[i] == 4 ) {
	            fours++;
	        }
	    }

	    //  Check for a flush

	    for ( var i = 0; i < 4; i++ ) {
	        if ( suits[i] == 5 ) {
	            flush = true;
	        }
	    }

	    if ( cardvals[4] - cardvals[1] == 3  &&              //  Consistent with 
	         cardvals[4] - cardvals[0] == 12 &&              //  A, T, J, Q, K...
	         flush ) {        //  If we also have a flush, then its a royal flush
	        combination = 9; //Royal Flush
	    }
	    else if ( cardvals[4] - cardvals[0] == 4 && flush ) {
	        combination = 8; //Straight Flush
	    }


	    //  Sort cards by face value (necessary to check for a straight)

	    for ( var i = 0; i < 5; i++ )
	        cardvals[i] = cardvals[i] % 13;
	    cardvals.sort(compare);


	    if ( combination == 0 ) {           // Don't check further if we've already won
	        if ( fours > 0 ) {
	            combination=8; //four of a kind
	        }
	        else if ( threes == 1 && pairs == 1 ) {
	            combination=6; //full house
	        }
	        else if ( flush ) {
	            combination=5;	//flush
	        }
	        else if ( cardvals[4] - cardvals[0] == 4 ) {
	            combination=4;		//straight
	        }
	        else if ( threes > 0 ) {
	            combination=3;	//3 of a kind
	        }
	        else if ( pairs == 2 ) {
	            combination=2;	//pair
	        }
	        else if ( matched[0]  == 2 ||
	                  matched[10] == 2 ||             
	                  matched[11] == 2 ||             
	                  matched[12] == 2 ) {
	            combination=1;	//jacks or better
	        }
	        else {
	            combination=0;
	        }
	    }
	    return combination;
	};

	function getDeck() {
		var deck=[];
	    deck.push('KS');
	    deck.push('QS');
	    deck.push('JS');
	    deck.push('TS');
	    deck.push('9S');
	    deck.push('8S');
	    deck.push('7S');
	    deck.push('6S');
	    deck.push('5S');
	    deck.push('4S');
	    deck.push('3S');
	    deck.push('2S');
	    deck.push('AS');
	    deck.push('KH');
	    deck.push('QH');
	    deck.push('JH');
	    deck.push('TH');
	    deck.push('9H');
	    deck.push('8H');
	    deck.push('7H');
	    deck.push('6H');
	    deck.push('5H');
	    deck.push('4H');
	    deck.push('3H');
	    deck.push('2H');
	    deck.push('AH');
	    deck.push('KD');
	    deck.push('QD');
	    deck.push('JD');
	    deck.push('TD');
	    deck.push('9D');
	    deck.push('8D');
	    deck.push('7D');
	    deck.push('6D');
	    deck.push('5D');
	    deck.push('4D');
	    deck.push('3D');
	    deck.push('2D');
	    deck.push('AD');
	    deck.push('KC');
	    deck.push('QC');
	    deck.push('JC');
	    deck.push('TC');
	    deck.push('9C');
	    deck.push('8C');
	    deck.push('7C');
	    deck.push('6C');
	    deck.push('5C');
	    deck.push('4C');
	    deck.push('3C');
	    deck.push('2C');
	    deck.push('AC');
	    deck.reverse();
	    return deck;
	};

	return Table;
});