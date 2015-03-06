angular.module("WalrusPunch").controller("hamburgerContentsController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"translationService",
	"dota1Service",
	function($scope, $rootScope, HAMBURGER_EVENTS, translationService, dota1Service){
		$scope.translationService = translationService;
		$scope.languageOptions = translationService.getTranslationOptions();
		$scope.selectedLanguage = $scope.languageOptions.find(function(option){
			return option.id === translationService.getCurrentTranslationId();
		});
		$scope.shouldUseDota1Portraits = dota1Service.isInDota1Mode();

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

		$scope.onDota1CheckboxToggled = function(){
			dota1Service.setDota1Mode($scope.shouldUseDota1Portraits);
		};

		$scope.closeHamburger = function(){
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
		};
	}
]);