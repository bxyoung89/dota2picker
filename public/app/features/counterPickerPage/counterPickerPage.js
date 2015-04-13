angular.module("WalrusPunch").controller("counterPickerPageController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"responsiveService",
	"analyticsService",
	"counterPickerPageService",
	"heroFilterService",
	"heroService",
	"translationService",
	function ($scope, $rootScope, HAMBURGER_EVENTS, responsiveService, analyticsService, counterPickerPageService, heroFilterService, heroService, translationService) {
		$scope.hamburgerIsOpen = false;
		$scope.translationService = translationService;
		$scope.counterPickerPageService = counterPickerPageService;
		$scope.shouldShowInstructions = localStorage.getItem("walrusPunchShowCounterPickerInstructions") === undefined || !!localStorage.getItem("walrusPunchShowCounterPickerInstructions");

		var searchKeyWordsWatcher = $scope.$watch(counterPickerPageService.getSearchKeyWords, function(){
			if($scope.shouldShowHeroGrid()){
				return;
			}
			heroFilterService.addHeroIfOneLeft(heroService.getTranslatedHeroes());
		});

		var enemyTeamWatcher = $scope.$watch(counterPickerPageService.getEnemyTeam, function(enemyTeam){
			if($scope.shouldShowHeroGrid() || enemyTeam.length === 0){
				return;
			}
			$scope.shouldShowInstructions = false;
			localStorage.setItem("walrusPunchShowCounterPickerInstructions", false);
		}, true);

		$rootScope.$on(HAMBURGER_EVENTS.open, function () {
			$scope.hamburgerIsOpen = true;
		});

		$rootScope.$on(HAMBURGER_EVENTS.close, function () {
			$scope.hamburgerIsOpen = false;
		});

		$scope.$on("$destroy", function(){
			searchKeyWordsWatcher();
		});



		$scope.closeHamburger = function () {
			$scope.hamburgerIsOpen = false;
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
			analyticsService.trackEvent("Hamburger Closed", "");
		};

		$scope.shouldShowHeroGrid = function(){
			var size = responsiveService.getSize();
			return size !== "small" && size !== "tiny";
		};

	}]);