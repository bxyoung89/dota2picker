angular.module("WalrusPunch").service("heroService", ["$http", "translationService", function($http, translationService){

	var heroes = [];
	var state = "loading";


	function HeroService(){
		getHeroes();
	}

	HeroService.prototype.retranslateHeroes = function(){
		translateHeroes();
	};

	HeroService.prototype.getState = function(){
		return state;
	};


	function getHeroes(){
		$http.get("/getHeroes")
			.success(function(data){
				heroes = [];
				if (!Array.isArray(data)) {
					data = JSON.parse(data);
				}
				data.forEach(function(hero){
					hero.fullImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
					hero.largeImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
					hero.smallImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
					hero.counterPickAdvantage = 0;
					hero.roles = hero.roles.map(function(role){
						return {
							id: role,
							translatedRole: role.capitalize(true)
						};
					});
					hero.overallAdvantage = 0;
					hero.empty = false;
					heroes.push(hero);
				});
				state = "done";
			})
			.error(function(data, status){
				state = "error";
			});
	}

	function translateHeroes(){
		heroes.forEach(function(hero){
			hero.translatedName = translationService.translateHeroName(hero);
			hero.roles.forEach(function(role){
				role.translatedName = translationService.translateRole(role.id);
			});
		});
	}




	return new HeroService();
}]);