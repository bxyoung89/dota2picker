angular.module("WalrusPunch").controller("aboutPageController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	function ($scope, $rootScope, HAMBURGER_EVENTS) {
		$scope.hamburgerIsOpen = false;

		$rootScope.$on(HAMBURGER_EVENTS.open, function () {
			$scope.hamburgerIsOpen = true;
		});

		$scope.closeHamburger = function () {
			$scope.hamburgerIsOpen = false;
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
		}

	}]);