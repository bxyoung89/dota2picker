angular.module("WalrusPunch").controller("counterPickListController", [
	"$scope",
	"heroService",
	"responsiveService",
	"guidService",
	"counterPickerPageService",
	"translationService",
	function($scope, heroService, responsiveService, guidService, counterPickerPageService, translationService){
		var mixItUpFilterTimeout = undefined;

		$scope.heroListId = "counter-pick-list-heroes-"+guidService.newGuid();
		$scope.heroes = heroService.getTranslatedHeroes();
		$scope.getHeroImage = responsiveService.getHeroImageSmall;
		$scope.hasAdvantageData = heroService.getState() === "done";
		$scope.hasEnemyTeam = counterPickerPageService.getEnemyTeam().length > 0;
		$scope.translationService = translationService;

		var heroesWatcher = $scope.$watch(heroService.getTranslatedHeroes, function(heroes){
			$scope.heroes = heroes;
			debounceFilterMixItUp();
		}, true);

		var heroServiceStateWatcher = $scope.$watch(heroService.getState, function(state){
			$scope.hasAdvantageData = state === "done";
			if($scope.hasAdvantageData){
				debounceFilterMixItUp();
			}
		});

		var hasEnemyTeamWatcher = $scope.$watch(counterPickerPageService.getEnemyTeam, function(enemyTeam){
			$scope.hasEnemyTeam = enemyTeam.length > 0;
		}, true);

		$scope.$on("$destroy", function(){
			heroesWatcher();
			heroServiceStateWatcher();
			hasEnemyTeamWatcher();
		});

		$scope.heroIsPositive = function(hero){
			return parseFloat(hero.counterPickAdvantage) > 0;
		};

		$scope.heroIsNeutral = function(hero){
			return parseFloat(hero.counterPickAdvantage) === 0;
		};

		$scope.heroIsNegative = function(hero){
			return parseFloat(hero.counterPickAdvantage) < 0;
		};

		$scope.getAdvantageIconClass = function(hero){
			if(hero.counterPickAdvantage > 0){
				return "ico-pointer-up";
			}
			if(hero.counterPickAdvantage < 0){
				return "ico-pointer-down";
			}
			return "ico-minus";
		};

		$scope.getImageForRole = function(role){
			return "/images/roles/"+(role.id.toLowerCase().replace(' ','_'))+".png";
		};

		function initializeMixItUp(){
			var heroList = $("#"+$scope.heroListId);
			heroList.mixItUp({
				controls: {
					enable: false
				},
				layout: {
					display: "block"
				},
				load: {
					filter: "none"
				}
			});
			heroList.mixItUp("sort", "advantage: asc");
		}


		function filterMixItUp(){
			var heroList = $("#"+$scope.heroListId);

			var filter = heroList.find(".mix").filter(function () {
				var heroId = $(this).attr("data-hero-id");
				var enemyTeamIsEmpty = counterPickerPageService.getEnemyTeam().length === 0;
				if(enemyTeamIsEmpty){
					return false;
				}
				var isOnEnemyTeam = counterPickerPageService.getEnemyTeam().any(function(enemy){
					return enemy.id === heroId;
				});
				return !isOnEnemyTeam;
			});

			heroList.mixItUp("multiMix", {
				filter: filter,
				sort: "advantage:desc"
			});
		}

		function debounceFilterMixItUp(){
			if(mixItUpFilterTimeout !== undefined){
				clearTimeout(mixItUpFilterTimeout);
			}
			mixItUpFilterTimeout = setTimeout(function(){
				clearTimeout(mixItUpFilterTimeout);
				mixItUpFilterTimeout = undefined;
				filterMixItUp();
			}, 500);
		}


		setTimeout(function(){
			initializeMixItUp();
		}, 0);
	}]);