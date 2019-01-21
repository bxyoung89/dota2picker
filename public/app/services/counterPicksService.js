angular.module("WalrusPunch").service("counterPicksService", [
	"heroService",
	"dataSourceService",
	function (heroService, dataSourceService) {

		function CounterPicksService() {

		}

		CounterPicksService.prototype.updateCounterPickData = function(enemyTeam){
			updateEnemyTeamCounterPickData(enemyTeam);
			updateOtherHeroesCounterPickData(enemyTeam);
		};

		function updateEnemyTeamCounterPickData(enemyTeam){
			enemyTeam.forEach(function(hero){
				hero.counterPickAdvantage = 0;
				hero.overallAdvantage = 0;
			});
		}

		function updateOtherHeroesCounterPickData(enemyTeam){
			var otherHeroes = getOtherHeroes(enemyTeam);
			getCounterPickAdvantage(otherHeroes, enemyTeam);
			getAdvantageIndex(otherHeroes);
		}

		function getCounterPickAdvantage(heroes, enemyTeam){
			if(heroes[0].advantages === undefined){
				heroes.forEach(function(hero){
					hero.counterPickAdvantage = 0;
				});
				return;
			}
			heroes.forEach(function(hero){
				var teamAdvantage = enemyTeam.average(function(enemy){
					var advantage = dataSourceService.getAdvantages(hero).find(function(advantage){
						return advantage.id === enemy.id;
					});
					if(!advantage){
						return 0;
					}
					return advantage.a;
				});
				hero.counterPickAdvantage = (Math.round(teamAdvantage * 1000) / 1000).toFixed(3);
			});
			heroService.updateHeroesWithCounterPickAdvantage(heroes);
		}

		function getAdvantageIndex(heroes){
			var sortedCounterPicks = heroes.sort(function(hero1, hero2){
				return hero1.counterPickAdvantage - hero2.counterPickAdvantage;
			});
			sortedCounterPicks.forEach(function(hero, index){
				hero.advantageIndex = index;
			});
		}

		function getOtherHeroes(enemyTeam){
			return heroService.getTranslatedHeroes().filter(function(hero){
				return !enemyTeam.any(function(enemy){
					return enemy.id === hero.id;
				});
			});
		}

		return new CounterPicksService();
	}]);