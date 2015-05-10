angular.module("WalrusPunch").controller("hamburgerContentsController", [
	"$scope",
	"$rootScope",
	"HAMBURGER_EVENTS",
	"translationService",
	"dota1Service",
	"analyticsService",
	"dataSourceService",
	function($scope, $rootScope, HAMBURGER_EVENTS, translationService, dota1Service, analyticsService, dataSourceService){
		$scope.translationService = translationService;
		$scope.languageOptions = translationService.getTranslationOptions();
		$scope.selectedLanguage = $scope.languageOptions.find(function(option){
			return option.id === translationService.getCurrentTranslationId();
		});
		$scope.shouldUseDota1Portraits = dota1Service.isInDota1Mode();
		$scope.dataSources = dataSourceService.getDataSources();
		$scope.selectedDataSource = $scope.dataSources.find(function(dataSource){
			return dataSource.id === dataSourceService.getCurrentDataSourceId();
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
			analyticsService.trackEvent("Language Changed", $scope.selectedLanguage.id);
		};

		$scope.onDota1CheckboxToggled = function(){
			dota1Service.setDota1Mode($scope.shouldUseDota1Portraits);
			analyticsService.trackEvent("Dota 1 Mode Toggled", $scope.shouldUseDota1Portraits ? "On" : "Off");
		};

		$scope.closeHamburger = function(){
			$rootScope.$broadcast(HAMBURGER_EVENTS.close);
		};

		$scope.onDataSourceChanged = function(){
			dataSourceService.changeDataSource($scope.selectedDataSource.id);
			analyticsService.trackEvent("Data Source Changed", $scope.selectedDataSource.id);
		};
	}
]);