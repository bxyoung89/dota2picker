angular.module("WalrusPunch").service("counterPickerPageService", [
	"$rootScope",
	"counterPicksService",
	"heroService",
	"ENEMY_TEAM_CHANGED",
	function ($rootScope, counterPicksService, heroService, ENEMY_TEAM_CHANGED) {

		var enemyTeamIds = [];
		var searchKeyWords = "";

		function CounterPickerPageService() {

		}

		CounterPickerPageService.prototype.getEnemyTeam = function () {
			var enemyTeam = heroService.getTranslatedHeroes().filter(function (hero) {
				return enemyTeamIds.some(function (enemyId) {
					return hero.id === enemyId;
				});
			});
			var sortedEnemyTeam = enemyTeamIds.map(function (id) {
				return enemyTeam.find(function (hero) {
					return hero.id === id;
				});
			});
			return sortedEnemyTeam;
		};

		CounterPickerPageService.prototype.getEnemyTeamIds = function () {
			return enemyTeamIds;
		};

		CounterPickerPageService.prototype.addEnemyHero = function (hero) {
			if (enemyTeamIds.length === 5) {
				return;
			}
			var matchingEnemyHero = enemyTeamIds.find(function (enemy) {
				return enemy === hero.id;
			});
			if (matchingEnemyHero !== undefined) {
				return;
			}
			enemyTeamIds.push(hero.id);
			onEnemyTeamChanged();
		};

		CounterPickerPageService.prototype.removeEnemyHero = function (hero) {
			var enemyTeamLength = enemyTeamIds.length;
			enemyTeamIds.remove(function (h) {
				return h === hero.id;
			});
			if (enemyTeamIds.length !== enemyTeamLength) {
				onEnemyTeamChanged();
			}
		};

		CounterPickerPageService.prototype.getSearchKeyWords = function () {
			return searchKeyWords;
		};

		CounterPickerPageService.prototype.setSearchKeyWords = function (search) {
			searchKeyWords = search;
		};

		function onEnemyTeamChanged() {
			counterPicksService.updateCounterPickData(CounterPickerPageService.prototype.getEnemyTeam());
			$rootScope.$broadcast(ENEMY_TEAM_CHANGED.enemyTeamChanged);
		}

		return new CounterPickerPageService();
	}]);