angular.module("WalrusPunch").controller("enemyTeamController", [
	"$scope",
	"$rootScope",
	"RESIZE_EVENTS",
	"translationService",
	"responsiveService",
	"counterPickerPageService",
	"analyticsService",
	function($scope, $rootScope, RESIZE_EVENTS, translationService, responsiveService, counterPickerPageService, analyticsService){
		$scope.translationService = translationService;
		$scope.heroes = [
			{
				empty: true
			},
			{
				empty: true
			},
			{
				empty: true
			},
			{
				empty: true
			},
			{
				empty: true
			}
		];

		var enemyTeamWatcher = $scope.$watch(counterPickerPageService.getEnemyTeam, function(newTeam){
			$scope.heroes = JSON.parse(JSON.stringify(newTeam));
			if($scope.heroes.length === 5){
				return;
			}
			for(var x = 0; x < 5 - newTeam.length; x+=1){
				$scope.heroes.push({
					empty: true
				});
			}
		}, true);

		$scope.$on("$destroy", function(){
			enemyTeamWatcher();
		});

		$scope.getHeroImage = responsiveService.getHeroImageCustom({
			tiny: "large",
			small: "large",
			medium: "large",
			large: "full"
		});

		$scope.onHeroClicked = function(hero){
			counterPickerPageService.removeEnemyHero(hero);
			analyticsService.trackEvent("Removed from Enemy Team", hero.name);
		};
	}]);