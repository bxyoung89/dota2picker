var SiteViewModel = (function () {

	var heroListId = "hero-list";
	var counterpickListId = "counterpick-list";
	var initialized = false;

	function SiteViewModel() {
		this.state = ko.observable("loading");
		this.enemyHeroes = ko.observableArray([]);
		this.heroes = ko.observableArray([]);
		this.modalOpen = ko.observable(false);
		this.roles = ko.observableArray([]);
		this.selectedRole = ko.observable("All Roles");
		this.dropdownIsOpen = ko.observable(false);
		this.searchText = ko.observable("");
		this.throttledText = ko.computed(this.searchText).extend({ throttle: 400});
		this.throttledText.subscribe(onSearchTextUpdated);
	}

	SiteViewModel.prototype.loadHeroes = function (heroes) {
		var rolesHash = {};
		if (!Array.isArray(heroes)) {
			heroes = JSON.parse(heroes);
		}
		heroes.forEach(function (hero) {
			hero.imageUrl = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
			hero.selected = ko.observable(false);
			hero.counterPickAdvantage = ko.observable(0);
			hero.roles = hero.roles.map(function (role) {
				var capitalizedRole = role.capitalize(true);
				rolesHash[capitalizedRole] = "";
				return capitalizedRole;
			});
			hero.overallAdvantage = ko.observable(0);
			this.heroes.push(hero);
		}, this);
		Object.keys(rolesHash).forEach(function (role) {
			this.roles.push(role.capitalize(true));
		}, this);
		this.roles.sort();
		this.roles.unshift("All Roles");
		this.state("normal");
		initializeIsotope();
		addDocumentClickListener.bind(this)();
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

	SiteViewModel.prototype.toggleDropdownOpen = function () {
		this.dropdownIsOpen(!this.dropdownIsOpen());
	};

	SiteViewModel.prototype.dropdownItemClicked = function (role) {
		this.selectedRole(role);
		this.dropdownIsOpen(false);
		refreshCounterPicks();
	};

	function updateCounterPicks() {
		this.heroes()
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
				hero.counterPickAdvantage((Math.round(teamAdvantage * 1000) / 1000).toFixed(3));
			}, this);
		var sortedCounterpicks = this.heroes().sortBy(function (hero) {
			return hero.counterPickAdvantage();
		});
		sortedCounterpicks.forEach(function (hero, index) {
			hero.overallAdvantage(index);
		});
		refreshCounterPicks();
	}

	function filterCounterpicksForIsotope(hero) {
		var vm = hero;//ko.dataFor(this);
		var siteVM = ko.dataFor($("body")[0]);
		if (siteVM.enemyHeroes().length <= 0) {
			return false;
		}
		var isNotInEnemyHeroes = siteVM.enemyHeroes().length > 0 && !siteVM.enemyHeroes().any(function (hero) {
			return hero.id === vm.id;
		});
		var hasSelectedRole = siteVM.selectedRole() === "All Roles" || vm.roles.any(function (role) {
			return role === siteVM.selectedRole();
		});
		return isNotInEnemyHeroes && hasSelectedRole;
	}

	function filterHeroesBySearchText() {
		var vm = ko.dataFor(this);
		return filterHeroBySearchText(vm);
	}

	function filterHeroBySearchText(hero) {
		var siteVM = ko.dataFor($("body")[0]);
		var searchTextIsEmpty = siteVM.throttledText().trim() === "";
		var heroNameStartsWithText = hero.name.toLowerCase().indexOf(siteVM.searchText().toLowerCase().trim()) !== -1;
		var heroNicknamesStartWithText = hero.nicknames.length !== 0 && hero.nicknames.any(function (name) {
			return name.toLowerCase().indexOf(siteVM.throttledText().toLowerCase().trim()) !== -1;
		});
		return searchTextIsEmpty || heroNameStartsWithText || heroNicknamesStartWithText;
	}

	function initializeIsotope() {
		var htmlLoadedInterval = setInterval(function () {
			var heroList = $("#" + heroListId);
			var counterPickList = $("#" + counterpickListId);
			if (heroList.length === 0 || counterPickList.length === 0) {
				return;
			}
			clearInterval(htmlLoadedInterval);
			counterPickList.mixItUp({
				controls: {
					enable: false
				},
				layout: {
					display: "block"
				},
				load: {
					filter: "none"
				}
			});
			heroList.mixItUp({
				controls: {
					enable: false
				}
			});
			heroList.mixItUp("sort", "name: desc");
			initialized = true;
		}, 500);
	}

	function addDocumentClickListener() {
		$(document).bind("click", function (e) {
			if ($(e.target).parents().hasClass("dropdown")) {
				return;
			}
			this.dropdownIsOpen(false);
		}.bind(this));

	}

	function refreshCounterPicks() {
		if (!initialized) {
			return;
		}
		var counterPickList = $("#" + counterpickListId);
		var filter = counterPickList.find(".mix").filter(function () {
			var hero = ko.dataFor(this);
			return filterCounterpicksForIsotope(hero);
		});
		counterPickList.mixItUp("multiMix", {
			filter: filter,
			sort: "advantage:desc"
		});
	}

	function refreshHeroList() {
		if (!initialized) {
			return;
		}
		var heroList = $("#" + heroListId);
		var filter = heroList.find(".mix").filter(function () {
			var hero = ko.dataFor(this);
			return filterHeroBySearchText(hero);
		});
		heroList.mixItUp("filter", filter, function () {
			var siteVM = ko.dataFor($("body")[0]);
			var shownHeroes = siteVM.heroes().filter(filterHeroBySearchText);
			if (shownHeroes.length !== 1 || siteVM.enemyHeroes().length === 5) {
				return;
			}
			if (shownHeroes[0].selected()) {
				return;
			}
			shownHeroes[0].selected(true);
			siteVM.enemyHeroes.push(shownHeroes[0]);
			updateCounterPicks.bind(siteVM)();
		});
	}

	function onSearchTextUpdated() {
		refreshHeroList();
	}

	return SiteViewModel;
}());