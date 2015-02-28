angular.module("WalrusPunch").service("heroService", [
	"$http",
	"$rootScope",
	"TRANSLATION_EVENTS",
	"translationService",
	function ($http, $rootScope, TRANSLATION_EVENTS, translationService) {

		var heroes = [];
		var state = "loading";
		var translationServiceInterval = undefined;


		function HeroService() {
			getHeroes();
			$rootScope.$on(TRANSLATION_EVENTS.translationChanged, function(){
				translateHeroes();
			});
		}

		HeroService.prototype.getState = function () {
			return state;
		};

		HeroService.prototype.getTranslatedHeroes = function () {
			if (state === "loading") {
				return [];
			}
			return heroes;
		};

		HeroService.prototype.retranslateHero = function(oldHero, newHero){
			oldHero.translatedName = newHero.translatedName;
			oldHero.roles = newHero.roles;
			oldHero.nickNames = newHero.nickNames;
		};


		function getHeroes() {
			$http.get("/getHeroes")
				.success(function (data) {
					heroes = [];
					if (!Array.isArray(data)) {
						data = JSON.parse(data);
					}
					data.forEach(function (hero) {
						hero.fullImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
						hero.largeImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
						hero.smallImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
						hero.counterPickAdvantage = 0;
						hero.overallAdvantage = 0;
						hero.empty = false;
						heroes.push(hero);
					});
					if (translationService.getState() !== "loading") {
						translateHeroes();
						state = "done";
						return;
					}
					translationServiceInterval = setInterval(function () {
						if (translationService.getState() === "loading") {
							return;
						}
						clearInterval(translationServiceInterval);
						translateHeroes();
						state = "done";
					}, 300);

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


		return new HeroService();
	}]);