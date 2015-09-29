angular.module("WalrusPunch").controller("enemyTeamController", [
	"$scope",
	"ENEMY_TEAM_CHANGED",
	"translationService",
	"responsiveService",
	"counterPickerPageService",
	"analyticsService",
	function($scope, ENEMY_TEAM_CHANGED, translationService, responsiveService, counterPickerPageService, analyticsService){
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

		$scope.$on(ENEMY_TEAM_CHANGED.enemyTeamChanged, function(){
			$scope.heroes = counterPickerPageService.getEnemyTeam();
			if($scope.heroes.length === 5){
				return;
			}
			var filledSlots = $scope.heroes.length;
			for(var x = 0; x < 5 - filledSlots; x+=1){
				$scope.heroes.push({
					empty: true
				});
			}
			setTimeout(function(){
				$scope.$apply();
			}, 0);
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