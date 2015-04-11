angular.module("WalrusPunch").controller("heroSearchBarController", [
	"$scope",
	"guidService",
	"translationService",
	"heroService",
	"counterPickerPageService",
	"analyticsService",
	function($scope, guidService, translationService, heroService, counterPickerPageService, analyticsService){
		var realInputValue = "";
		var allHeroNames = [];

		$scope.translationService = translationService;
		$scope.inputId = "hero-search-input-"+guidService.newGuid();


		var searchKeyWordsWatcher = $scope.$watch(counterPickerPageService.getSearchKeyWords, function(newKeyWords){
			$scope.inputValue(newKeyWords);
		});

		var translatedHeroesWatcher = $scope.$watch(heroService.getTranslatedHeroes, function(translatedHeroes){
			updateHeroNames(translatedHeroes);
		}, true);

		$scope.$on("$destroy", function(){
			searchKeyWordsWatcher();
			translatedHeroesWatcher();
		});



		$scope.inputValue = function(newValue){
			if(newValue === undefined){
				return realInputValue;
			}
			realInputValue = newValue;
			counterPickerPageService.setSearchKeyWords(newValue);
			analyticsService.trackEvent("Searched for Hero", newValue);
		};

		function updateHeroNames(translatedHeroes){
			translatedHeroes.forEach(function(hero){
				allHeroNames.push(hero.name);
				if(hero.nickNames === undefined){
					return;
				}
				hero.nickNames.forEach(function(name){
					if(name.length > 2){
						allHeroNames.push(name.capitalize());
						return;
					}
					allHeroNames.push(name);
				});
			});
		}
		function substringMatcher(strs) {
			return function findMatches(q, cb) {
				var matches, substrRegex;

				// an array that will be populated with substring matches
				matches = [];

				// regex used to determine if a string contains the substring `q`
				substrRegex = new RegExp(q, 'i');

				// iterate through the pool of strings and for any string that
				// contains the substring `q`, add it to the `matches` array
				$.each(strs, function(i, str) {
					if (substrRegex.test(str)) {
						// the typeahead jQuery plugin expects suggestions to a
						// JavaScript object, refer to typeahead docs for more info
						matches.push({ value: str });
					}
				});

				cb(matches);
			};
		}

		setTimeout(function(){
			$("#"+$scope.inputId).typeahead({
					hint: true,
					highlight: true,
					minLength: 1
				},
				{
					name: 'allHeroNames',
					displayKey: 'value',
					source: substringMatcher(allHeroNames)
				});
		}, 0);
	}]);