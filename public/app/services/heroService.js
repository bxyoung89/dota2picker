angular.module("WalrusPunch").service("heroService", [
	"$http",
	"$rootScope",
	"TRANSLATION_EVENTS",
	"HERO_EVENTS",
	"translationService",
	"heroBaseService",
	function ($http, $rootScope, TRANSLATION_EVENTS, HERO_EVENTS, translationService, heroBaseService) {
		var heroes = heroBaseService.getHeroBases();
		var state = "loading";

		function HeroService() {
			processHeroBases();
			getHeroes();
			$rootScope.$on(TRANSLATION_EVENTS.translationChanged, function(){
				translateHeroes();
			});
		}

		$rootScope.$watch(translationService.getState, function(translationServiceState){
			if(translationServiceState !== "done"){
				return;
			}
			translateHeroes();
		});

		HeroService.prototype.getState = function () {
			return state;
		};

		HeroService.prototype.getTranslatedHeroes = function () {
			return heroes;
		};

		HeroService.prototype.retranslateHero = function(oldHero, newHero){
			oldHero.translatedName = newHero.translatedName;
			oldHero.roles = newHero.roles;
			oldHero.nickNames = newHero.nickNames;
		};

		HeroService.prototype.updateHeroesWithCounterPickAdvantage = function(updatedHeros){
			heroes.forEach(function(hero){
				var matchingHero = updatedHeros.find(function(h){
					return h.id === hero.id;
				});
				if(matchingHero === undefined){
					return;
				}
				hero.counterPickAdvantage = matchingHero.counterPickAdvantage;
			});
			$rootScope.$broadcast(HERO_EVENTS.heroesUpdated);
		};


		function getHeroes() {
			$http.get("/getAdvantages")
				.success(function (data) {
					if (!Array.isArray(data)) {
						data = JSON.parse(data);
					}
					if(data.length === 0){
						setTimeout(function(){
							getHeroes();
						}, 5000);
						return;
					}
					data.forEach(function (hero) {
						var matchingHero = heroes.find(function(h){
							return h.id === hero.id;
						});
						matchingHero.advantages = hero.advantages;
					});
					if(translationService.getState() === "done"){
						translateHeroes();
					}
					$rootScope.$broadcast(HERO_EVENTS.heroesUpdated);
				})
				.error(function (data, status) {
					state = "error";
				});
		}

		function translateHeroes() {
			heroes.forEach(function (hero) {
				hero.translatedName = translationService.translateHeroName(hero.name);
				hero.nickNames = translationService.getHeroNicknames(hero.name);
			});
		}

		function processHeroBases(){
			heroes.forEach(function(hero){
				hero.fullImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
				hero.largeImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
				hero.smallImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
				hero.counterPickAdvantage = 0;
				hero.overallAdvantage = 0;
				hero.empty = false;
			});
		}


		return new HeroService();
	}]);