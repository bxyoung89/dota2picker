angular.module("WalrusPunch").controller("appHeaderController", [
	"$scope",
	"translationService",
	"responsiveService",
	function ($scope, translationService, responsiveService) {
		$scope.translationService = translationService;
		$scope.responsiveService = responsiveService;

		$scope.openAboutModal = function(){
			//todo
		};
	}]);