angular.module("WalrusPunch").controller("heroGridController", [
	"$scope",
	"heroService",
	"counterPickerPageService",
	"translationService",
	"responsiveService",
	"guidService",
	function($scope, heroService, counterPickerPageService, translationService, responsiveService, guidService){
		$scope.heroGridId = "hero-grid-"+guidService.newGuid();
		$scope.translationService = translationService;
		$scope.heroes = JSON.parse(JSON.stringify(heroService.getTranslatedHeroes()));

		var translatedHeroesWatcher = $scope.$watch(heroService.getTranslatedHeroes, function(translatedHeroes){
			if($scope.heroes.length === 0){
				$scope.heroes = JSON.parse(JSON.stringify(translatedHeroes));
				return;
			}
			$scope.heroes.forEach(function(hero){
				var matchingHero = translatedHeroes.find(function(translatedHero){
					return translatedHero.id === hero.id;
				});
				if(matchingHero === undefined){
					return;
				}

				heroService.retranslateHero(hero, matchingHero);
			});
		}, true);

		var enemyTeamWatcher = $scope.$watch(counterPickerPageService.getEnemyTeam, function(enemyTeam){
			$scope.heroes.forEach(function(hero){
				var matchingEnemyHero = enemyTeam.find(function(enemyHero){
					return enemyHero.id === hero.id;
				});
				hero.selected = matchingEnemyHero !== undefined;
			});
		});

		var searchKeyWordsWatcher = $scope.$watch(counterPickerPageService.getSearchKeyWords, function(search){
			filterMixItUp(search);
		});

		$scope.$on("$destroy", function(){
			translatedHeroesWatcher();
			enemyTeamWatcher();
			searchKeyWordsWatcher();
		});

		$scope.getHeroImage = responsiveService.getHeroImageLarge;

		$scope.onHeroClicked = function(hero){
			counterPickerPageService.addEnemyHero(hero);
		};


		function filterMixItUp(searchText){
			var heroGrid = $("#"+$scope.heroGridId);
			var filter = heroGrid.find(".mix").filter(function () {
				var heroId = $(this).attr("data-hero-id");
				return filterHeroBySearchText(searchText, heroId);
			});
			heroGrid.mixItUp("filter", filter, addHeroIfOneLeft);
		}

		function initializeMixItUp(){
			var heroGrid = $("#"+$scope.heroGridId);
			heroGrid.mixItUp({
				controls: {
					enable: false
				}
			});
			heroGrid.mixItUp("sort", "name: desc");
		}

		function filterHeroBySearchText(searchText, heroId){
			if(searchText.trim() === ""){
				return true;
			}
			var hero = $scope.heroes.find(function(hero){
				return hero.id === heroId;
			});
			if(hero === undefined){
				return true;
			}
			var sanitizedSearchText = searchText.toLowerCase().trim();
			var heroNameStartsWithText = hero.translatedName.toLowerCase().indexOf(sanitizedSearchText) !== -1;
			if(heroNameStartsWithText){
				return true;
			}

			if(hero.nickNames.length === 0){
				return false;
			}

			return hero.nickNames.any(function(name){
				return name.toLowerCase().indexOf(sanitizedSearchText) !== -1;
			});
		}

		function addHeroIfOneLeft(){
			var shownHeroes = $scope.heroes.filter(function(hero){
				return filterHeroBySearchText(counterPickerPageService.getSearchKeyWords(), hero.id);
			});
			if (shownHeroes.length !== 1) {
				return;
			}
			if (shownHeroes[0].selected || counterPickerPageService.getEnemyTeam().length === 5) {
				return;
			}
			counterPickerPageService.addEnemyHero(shownHeroes[0]);
		}

		setTimeout(function(){
			initializeMixItUp();
		}, 0);




	}
]);