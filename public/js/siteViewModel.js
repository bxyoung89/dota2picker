var SiteViewModel = (function () {

	var heroListId = "hero-list";
	var counterpickListId = "counterpick-list";
	var initialized = false;

	function SiteViewModel() {
		this.state = ko.observable("loading");
		this.enemyHeroes = ko.observableArray([]);
		this.counterPicks = ko.observableArray([]);
		this.heroes = ko.observableArray([]);
		this.modalOpen = ko.observable(false);
	}

	SiteViewModel.prototype.loadHeroes = function (heroes) {
		heroes.forEach(function (hero) {
			hero.imageUrl = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
			hero.selected = ko.observable(false);
			hero.counterPickAdvantage = ko.observable(0);
			this.heroes.push(hero);
			this.counterPicks.push(hero);
		}, this);
		this.state("normal");
		initializeIsotope();
	};

	SiteViewModel.prototype.heroSelected = function (hero) {
		if (hero.selected()) {
			this.heroRemoved(hero);
			return;
		}
		if (this.enemyHeroes().length === 5) {
			return;
		}
		hero.selected(true);
		this.enemyHeroes.push(hero);
		updateCounterPicks.bind(this)();
	};

	SiteViewModel.prototype.heroRemoved = function (hero) {
		if (!hero.selected()) {
			return;
		}
		hero.selected(false);
		this.enemyHeroes.remove(function (h) {
			return h.id === hero.id;
		});
		updateCounterPicks.bind(this)();
	};

	SiteViewModel.prototype.openModal = function () {
		this.modalOpen(true);
	};

	SiteViewModel.prototype.closeModal = function () {
		this.modalOpen(false);
	};

	function updateCounterPicks() {
//		var counterPickHeroes = this.heroes().filter(function(hero){
//			return !this.enemyHeroes().any(function(h){
//				return h.id === hero.id;
//			});
//		}, this);
		this.counterPicks()
			.filter(function (hero) {
				return !this.enemyHeroes().any(function (h) {
					return h.id === hero.id;
				});
			}, this)
			.forEach(function (hero) {
				var teamAdvantage = this.enemyHeroes().average(function (enemy) {
					return hero.advantages.find(function (advantage) {
						return advantage.name === enemy.name;
					}).advantage;
				});
				hero.counterPickAdvantage(Math.round(teamAdvantage * 1000) / 1000);
			}, this);
//		counterPickHeroes.sort(function(a, b){
//			return b.counterPickAdvantage() - a.counterPickAdvantage();
//		});
//		this.counterPicks(counterPickHeroes);
		setTimeout(function(){
			if(!initialized){
				return;
			}
			var counterPickList = $("#"+counterpickListId);
			counterPickList.isotope({
				filter: filterCounterpicksForIsotope,
				sortBy: "advantage"
			});
			counterPickList.isotope("reloadItems");
			counterPickList.isotope({
				filter: filterCounterpicksForIsotope,
				sortBy: "advantage"
			});
			setTimeout(function(){
				counterPickList.isotope({
					filter: filterCounterpicksForIsotope,
					sortBy: "advantage"
				});
			}, 500);

		}, 500);
	}

	function filterCounterpicksForIsotope(){
		var vm = ko.dataFor(this);
		var siteVM = ko.dataFor($("body")[0]);
		return siteVM.enemyHeroes().length > 0 && !siteVM.enemyHeroes().any(function(hero){
			return hero.id === vm.id;
		});
	}

	function initializeIsotope(){
		var htmlLoadedInterval = setInterval(function(){
			var heroList = $("#" + heroListId);
			var counterPickList = $("#"+counterpickListId);
			if(heroList.length === 0 || counterPickList.length === 0){
				return;
			}
			clearInterval(htmlLoadedInterval);
			counterPickList.isotope({
				itemSelector: ".hero",
				layoutMode: "vertical",
				getSortData: {
					advantage: function(element){
						var vm = ko.dataFor(element);
						return -1 * vm.counterPickAdvantage();
					}
				},
				sortBy: "advantage",
				filter: filterCounterpicksForIsotope
			});
			counterPickList.isotope("bindResize");
			initialized = true;
		}, 500);
	}




	return SiteViewModel;
}());