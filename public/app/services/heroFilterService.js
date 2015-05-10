angular.module("WalrusPunch").service("heroFilterService", ["counterPickerPageService", "analyticsService", function(counterPickerPageService, analyticsService){

	function HeroFilterService(){}

	HeroFilterService.prototype.filterHeroBySearchText = function(heroes, searchText, heroId){
		if(searchText.trim() === ""){
			return true;
		}
		var hero = heroes.find(function(hero){
			return hero.id === heroId;
		});
		if(hero === undefined){
			return true;
		}
		var sanitizedSearchText = searchText.toLowerCase().trim();
		var heroNameStartsWithText = hero.translatedName.toLowerCase().indexOf(sanitizedSearchText) !== -1;
		if(heroNameStartsWithText){
			return true;
		}

		if(hero.nickNames.length === 0){
			return false;
		}

		return hero.nickNames.any(function(name){
			return name.toLowerCase().indexOf(sanitizedSearchText) !== -1;
		});
	};

	HeroFilterService.prototype.addHeroIfOneLeft = function(heroes){
		var shownHeroes = heroes.filter(function(hero){
			return HeroFilterService.prototype.filterHeroBySearchText(heroes, counterPickerPageService.getSearchKeyWords(), hero.id);
		});
		if (shownHeroes.length !== 1) {
			return;
		}
		if (shownHeroes[0].selected || counterPickerPageService.getEnemyTeamIds().length === 5) {
			return;
		}
		counterPickerPageService.addEnemyHero(shownHeroes[0]);
		analyticsService.trackEvent("Hero Selected by text Search", shownHeroes[0].name);
	};


	return new HeroFilterService();
}]);