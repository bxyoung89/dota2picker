angular.module("WalrusPunch").service("counterPickerPageService", [ "counterPicksService", function(counterPicksService){

	var enemyTeam = [];
	var searchKeyWords = "";

	function CounterPickerPageService(){

	}

	CounterPickerPageService.prototype.getEnemyTeam = function(){
		return enemyTeam;
	};

	CounterPickerPageService.prototype.addEnemyHero = function(hero){
		if(enemyTeam.length === 5){
			return;
		}
		var matchingEnemyHero = enemyTeam.find(function(enemy){
			return enemy.id === hero.id;
		});
		if(matchingEnemyHero !== undefined){
			return;
		}
		enemyTeam.push(hero);
		onEnemyTeamChanged();
	};

	CounterPickerPageService.prototype.removeEnemyHero = function(hero){
		var enemyTeamLength = enemyTeam.length;
		enemyTeam.remove(function(h){
			return h.id === hero.id;
		});
		if(enemyTeam.length !== enemyTeamLength){
			onEnemyTeamChanged();
		}
	};

	CounterPickerPageService.prototype.getSearchKeyWords = function(){
		return searchKeyWords;
	};

	CounterPickerPageService.prototype.setSearchKeyWords = function(search){
		searchKeyWords = search;
	};

	function onEnemyTeamChanged(){
		counterPicksService.updateCounterPickData(enemyTeam);
	}

	return new CounterPickerPageService();
}]);