angular.module("WalrusPunch").controller("counterPickListController", [
	"$scope",
	"heroService",
	"responsiveService",
	"guidService",
	"counterPickerPageService",
	"translationService",
	"HERO_EVENTS",
	function($scope, heroService, responsiveService, guidService, counterPickerPageService, translationService, HERO_EVENTS){
		var mixItUpFilterTimeout = undefined;

		$scope.heroListId = "counter-pick-list-heroes-"+guidService.newGuid();
		$scope.heroes = heroService.getTranslatedHeroes();
		$scope.getHeroImage = responsiveService.getHeroImageSmall;
		$scope.hasAdvantageData = heroService.getState() === "done";
		$scope.hasEnemyTeam = counterPickerPageService.getEnemyTeamIds().length > 0;
		$scope.translationService = translationService;

		var hasEnemyTeamWatcher = $scope.$watch(counterPickerPageService.getEnemyTeamIds, function(enemyTeam){
			$scope.hasEnemyTeam = enemyTeam.length > 0;
		}, true);

		$scope.$on(HERO_EVENTS.heroesUpdated, function(){
			$scope.hasAdvantageData = true;
			$scope.heroes = heroService.getTranslatedHeroes();
			debounceFilterMixItUp();
		});

		$scope.$on("$destroy", function(){
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
				var enemyTeamIsEmpty = counterPickerPageService.getEnemyTeamIds().length === 0;
				if(enemyTeamIsEmpty){
					return false;
				}
				var isOnEnemyTeam = counterPickerPageService.getEnemyTeamIds().any(function(enemy){
					return enemy === heroId;
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