angular.module("WalrusPunch").controller("counterPickerPageController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"responsiveService",
	function ($scope, $rootScope, HAMBURGER_EVENTS, responsiveService) {
		$scope.hamburgerIsOpen = false;

		$rootScope.$on(HAMBURGER_EVENTS.open, function () {
			$scope.hamburgerIsOpen = true;
		});

		$rootScope.$on(HAMBURGER_EVENTS.close, function () {
			$scope.hamburgerIsOpen = false;
		});

		$scope.closeHamburger = function () {
			$scope.hamburgerIsOpen = false;
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
		};

		$scope.shouldShowHeroGrid = function(){
			var size = responsiveService.getSize();
			return size !== "small" && size !== "tiny";
		};

	}]);