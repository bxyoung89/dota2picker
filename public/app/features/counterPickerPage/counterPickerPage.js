angular.module("WalrusPunch").controller("counterPickerPageController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"responsiveService",
	"analyticsService",
	"counterPickerPageService",
	"heroFilterService",
	"heroService",
	function ($scope, $rootScope, HAMBURGER_EVENTS, responsiveService, analyticsService, counterPickerPageService, heroFilterService, heroService) {
		$scope.hamburgerIsOpen = false;

		var searchKeyWordsWatcher = $scope.$watch(counterPickerPageService.getSearchKeyWords, function(search){
			if($scope.shouldShowHeroGrid()){
				return;
			}
			heroFilterService.addHeroIfOneLeft(heroService.getTranslatedHeroes());
		});

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