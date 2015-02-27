angular.module("WalrusPunch").service("counterPickerPageService", [function(){

	var enemyTeam = [];

	function CounterPickerPageService(){

	}

	CounterPickerPageService.prototype.getEnemyTeam = function(){
		return enemyTeam;
	};

	CounterPickerPageService.prototype.addEnemyHero = function(hero){
		if(enemyTeam.length === 5){
			return;
		}
		enemyTeam.push(hero);
	};

	CounterPickerPageService.prototype.removeEnemyHero = function(hero){
		enemyTeam.remove(function(h){
			return h.id === hero.id;
		});
	};

	return new CounterPickerPageService();
}]);