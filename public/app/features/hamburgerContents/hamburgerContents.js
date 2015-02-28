angular.module("WalrusPunch").controller("hamburgerContentsController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"translationService",
	function($scope, $rootScope, HAMBURGER_EVENTS, translationService){
		$scope.translationService = translationService;
		$scope.languageOptions = translationService.getTranslationOptions();
		$scope.selectedLanguage = $scope.languageOptions.find(function(option){
			return option.id === translationService.getCurrentTranslationId();
		});

		var languageOptionsWatcher = $scope.$watch(translationService.getTranslationOptions, function(languageOptions){
			$scope.selectedLanguage = languageOptions.find(function(option){
				return option.id === translationService.getCurrentTranslationId();
			});
			$scope.languageOptions = languageOptions;
		});

		$scope.$on("$destroy", function(){
			languageOptionsWatcher();
		});

		$scope.onSelectedLanguageChanged = function(){
			translationService.changeTranslation($scope.selectedLanguage.id);
		};

		$scope.closeHamburger = function(){
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
		};
	}
]);