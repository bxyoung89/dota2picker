angular.module("WalrusPunch").controller("appHeaderController", [
	"$scope",
	"$rootScope",
	"RESIZE_EVENTS",
	"HAMBURGER_EVENTS",
	"translationService",
	"analyticsService",
	function ($scope, $rootScope, RESIZE_EVENTS, HAMBURGER_EVENTS, translationService, analyticsService) {
		$scope.translationService = translationService;

		$rootScope.$on(RESIZE_EVENTS.resized, function(){
			$scope.$apply();
		});

		$scope.openHamburger = function(){
			$rootScope.$broadcast(HAMBURGER_EVENTS.open);
			analyticsService.trackEvent("Hamburger Opened", "");
		};
	}]);