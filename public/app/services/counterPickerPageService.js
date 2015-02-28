angular.module("WalrusPunch").service("counterPickerPageService", [function(){

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
	};

	CounterPickerPageService.prototype.removeEnemyHero = function(hero){
		enemyTeam.remove(function(h){
			return h.id === hero.id;
		});
	};

	CounterPickerPageService.prototype.getSearchKeyWords = function(){
		return searchKeyWords;
	};

	CounterPickerPageService.prototype.setSearchKeyWords = function(search){
		searchKeyWords = search;
	};

	return new CounterPickerPageService();
}]);