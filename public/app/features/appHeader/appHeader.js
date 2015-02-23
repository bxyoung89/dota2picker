angular.module("WalrusPunch").controller("appHeaderController", [
	"$scope",
	"$rootScope",
	"RESIZE_EVENTS",
	"HAMBURGER_EVENTS",
	"translationService",
	"responsiveService",
	function ($scope, $rootScope, RESIZE_EVENTS, HAMBURGER_EVENTS, translationService, responsiveService) {
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
		};
	}]);