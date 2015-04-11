angular.module("WalrusPunch").controller("appHeaderController", [
	"$scope",
	"$rootScope",
	"RESIZE_EVENTS",
	"HAMBURGER_EVENTS",
	"translationService",
	"responsiveService",
	"analyticsService",
	function ($scope, $rootScope, RESIZE_EVENTS, HAMBURGER_EVENTS, translationService, responsiveService, analyticsService) {
		$scope.translationService = translationService;
		$scope.responsiveSize = responsiveService.getSize();

		var responsiveSizeWatcher = $scope.$watch(responsiveService.getSize, function(newSize){
			$scope.responsiveSize = newSize;
		});

		$scope.$on("$destroy", function(){
			responsiveSizeWatcher();
		});

		$rootScope.$on(RESIZE_EVENTS.resized, function(){
			$scope.$apply();
		});

		$scope.openHamburger = function(){
			$rootScope.$broadcast(HAMBURGER_EVENTS.open);
			analyticsService.trackEvent("Hamburger Opened", "");
		};
	}]);