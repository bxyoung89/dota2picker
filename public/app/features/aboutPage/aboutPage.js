angular.module("WalrusPunch").controller("aboutPageController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"TRANSLATION_EVENTS",
	"translationService",
	"translatorInformationService",
	function ($scope, $rootScope, HAMBURGER_EVENTS, TRANSLATION_EVENTS, translationService, translatorInformationService) {
		$scope.hamburgerIsOpen = false;
		$scope.translationService = translationService;
		$scope.translators = translatorInformationService.getTranslators();

		$scope.$on(TRANSLATION_EVENTS.translationChanged, function(){
			translateTranslators();
		});

		$rootScope.$on(HAMBURGER_EVENTS.open, function () {
			$scope.hamburgerIsOpen = true;
		});

		$scope.closeHamburger = function () {
			$scope.hamburgerIsOpen = false;
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
		};


		function translateTranslators(){
			$scope.translators.forEach(function(translator){
				translator.translatedDescription = translationService.translateString(translator.description);
				translator.translatedLanguages = translator.languages.map(function(language){
					return translationService.translateLanguage(language);
				}).join("  |  ");
			});
		}






		translateTranslators();

	}]);