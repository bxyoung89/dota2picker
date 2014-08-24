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
		this.roles = ko.observableArray([]);
		this.selectedRole = ko.observable("All Roles");
		this.dropdownIsOpen = ko.observable(false);
		this.searchText = ko.observable("");
		this.searchText.subscribe(onSearchTextUpdated);
	}

	SiteViewModel.prototype.loadHeroes = function (heroes) {
		var rolesHash = {};
		if(!Array.isArray(heroes)){
			heroes = JSON.parse(heroes);
		}
		heroes.forEach(function (hero) {
			hero.imageUrl = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
			hero.selected = ko.observable(false);
			hero.counterPickAdvantage = ko.observable(0);
			hero.roles = hero.roles.map(function(role){
				var capitalizedRole = role.capitalize(true);
				rolesHash[capitalizedRole] = "";
				return capitalizedRole;
			});
			this.heroes.push(hero);
			this.counterPicks.push(hero);
		}, this);
		Object.keys(rolesHash).forEach(function(role){
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

	SiteViewModel.prototype.toggleDropdownOpen = function(){
		this.dropdownIsOpen(!this.dropdownIsOpen());
	};

	SiteViewModel.prototype.dropdownItemClicked = function(role){
		this.selectedRole(role);
		this.dropdownIsOpen(false);
		refreshCounterPicks();
	};

	SiteViewModel.prototype.getRoleIcon = function(role){
		var lowercase = role;
		lowercase.toLowerCase();
		return "images/roles/"+(lowercase.replace(" ","_"))+".png";
	};

	function updateCounterPicks() {
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
		refreshCounterPicks();
	}

	function filterCounterpicksForIsotope(){
		var vm = ko.dataFor(this);
		var siteVM = ko.dataFor($("body")[0]);
		var isNotInEnemyHeroes = siteVM.enemyHeroes().length > 0 && !siteVM.enemyHeroes().any(function(hero){
			return hero.id === vm.id;
		});
		var hasSelectedRole = siteVM.selectedRole() === "All Roles" || vm.roles.any(function(role){
			return role === siteVM.selectedRole();
		});
		return isNotInEnemyHeroes && hasSelectedRole;
	}

	function filterHeroesBySearchText(){
		var vm = ko.dataFor(this);
		var siteVM = ko.dataFor($("body")[0]);
		var searchTextIsEmpty = siteVM.searchText().trim() === "";
		var heroNameStartsWithText = vm.name.toLowerCase().startsWith(siteVM.searchText().toLowerCase().trim());
		var heroNicknamesStartWithText = vm.nicknames.length !== 0 && vm.nicknames.any(function(name){
			return name.toLowerCase().startsWith(siteVM.searchText().toLowerCase().trim());
		});
		return searchTextIsEmpty || heroNameStartsWithText || heroNicknamesStartWithText;
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
			heroList.isotope({
				itemSelector: ".hero",
				layoutMode: "fitRows",
				getSortData: {
					name: ".name"
				},
				sortBy: "name",
				filter: filterHeroesBySearchText
			});
			heroList.isotope("bindResize");
			initialized = true;
		}, 500);
	}

	function addDocumentClickListener(){
		$(document).bind("click", function(e){
			if($(e.target).parents().hasClass("dropdown")){
				return;
			}
			this.dropdownIsOpen(false);
		}.bind(this));

	}

	function refreshCounterPicks(){
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
	
	function refreshHeroList(){
		setTimeout(function(){
			if(!initialized){
				return;
			}
			var heroList = $("#"+heroListId);
			heroList.isotope({
				filter: filterHeroesBySearchText
			});
			heroList.isotope("reloadItems");
			heroList.isotope({
				filter: filterHeroesBySearchText
			});
			setTimeout(function(){
				heroList.isotope({
					filter: filterHeroesBySearchText
				});
			}, 500);

		}, 500);
	}

	function onSearchTextUpdated(){
		refreshHeroList();
	}



	return SiteViewModel;
}());