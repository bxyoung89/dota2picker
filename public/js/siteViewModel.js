var SiteViewModel = (function () {

	var heroListId = "hero-list";
	var counterpickListId = "counterpick-list";
	var initialized = false;
	var allHeroNames = [];
	var sizes = [
		{
			name: "tiny",
			value: function(width){
				return width < 500;
			}
		},
		{
			name: "small",
			value: function(width){
				return width < 805 && width > 500;
			}
		},
		{
			name: "medium",
			value: function(width){
				return width < 1100 && width >= 805;
			}
		},
		{
			name: "large",
			value: function(width){
				return width >= 1100;
			}
		}
	];
	var resizeRefreshTimeout;

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
		this.currentSize = ko.observable();
		this.heroListInitialized = ko.observable(false);
		this.emptyEnemyTeam = ko.computed(function(){
			return emptySlots(this.enemyHeroes()) === 5;
		}.bind(this));

		for(var x = 0; x < 5; x++){
			this.enemyHeroes.push({
				empty: true
			});
		}

		setCurrentSize.bind(this)();
	}

	SiteViewModel.prototype.loadHeroes = function (heroes) {
		var rolesHash = {};
		if (!Array.isArray(heroes)) {
			heroes = JSON.parse(heroes);
		}
		heroes.forEach(function (hero) {
			hero.fullImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
			hero.largeImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
			hero.smallImage = "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
			hero.selected = ko.observable(false);
			hero.counterPickAdvantage = ko.observable(0);
			hero.roles = hero.roles.map(function (role) {
				var capitalizedRole = role.capitalize(true);
				rolesHash[capitalizedRole] = "";
				return capitalizedRole;
			});
			hero.overallAdvantage = ko.observable(0);
			hero.empty = false;
			this.heroes.push(hero);
			allHeroNames.push(hero.name);
			hero.nicknames.forEach(function(name){
				allHeroNames.push(name.capitalize(true));
			});
		}, this);
		Object.keys(rolesHash).forEach(function (role) {
			this.roles.push(role.capitalize(true));
		}, this);
		this.roles.sort();
		this.roles.unshift("All Roles");
		this.state("normal");
		initializeJqueryThings.bind(this)();
		addDocumentClickListener.bind(this)();
	};

	SiteViewModel.prototype.heroSelected = function (hero) {
		if (hero.selected()) {
			this.heroRemoved(hero);
			return;
		}
		if (emptySlots(this.enemyHeroes()) === 0) {
			return;
		}
		hero.selected(true);
		this.enemyHeroes.pop();
		this.enemyHeroes.unshift(hero);
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
		this.enemyHeroes.push({
			empty: true
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

	SiteViewModel.prototype.getHeroGridImageUrl = function(hero){
		switch(this.currentSize().name){
			case "large": return hero.fullImage;
			case "medium": return hero.largeImage;
			case "small": return hero.smallImage;
			case "tiny": return hero.smallImage;
		}
	};

	SiteViewModel.prototype.getEnemyTeamImageUrl = function(hero){
		switch(this.currentSize().name){
			case "large": return hero.largeImage;
			case "medium": return hero.largeImage;
			case "small": return hero.smallImage;
			case "tiny": return hero.smallImage;
		}
	};

	SiteViewModel.prototype.getCounterPickImageUrl = function(hero){
		switch(this.currentSize().name){
			case "large": return hero.largeImage;
			case "medium": return hero.largeImage;
			case "small": return hero.smallImage;
			case "tiny": return hero.smallImage;
		}
	};

	function updateCounterPicks() {
		this.heroes()
			.filter(function (hero) {
				return !this.enemyHeroes().any(function (h) {
					return h.id === hero.id;
				});
			}, this)
			.forEach(function (hero) {
				var teamAdvantage = this.enemyHeroes().filter(function(hero){
					return !hero.empty;
				}).average(function (enemy) {
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
		var vm = hero;
		var siteVM = ko.dataFor($("body")[0]);
		if (emptySlots(siteVM.enemyHeroes()) === 5) {
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

	function filterHeroBySearchText(hero) {
		var siteVM = ko.dataFor($("body")[0]);
		var searchTextIsEmpty = siteVM.throttledText().trim() === "";
		var heroNameStartsWithText = hero.name.toLowerCase().indexOf(siteVM.searchText().toLowerCase().trim()) !== -1;
		var heroNicknamesStartWithText = hero.nicknames.length !== 0 && hero.nicknames.any(function (name) {
			return name.toLowerCase().indexOf(siteVM.throttledText().toLowerCase().trim()) !== -1;
		});
		return searchTextIsEmpty || heroNameStartsWithText || heroNicknamesStartWithText;
	}

	function initializeJqueryThings() {
		var htmlLoadedInterval = setInterval(function () {
			var heroList = $("#" + heroListId);
			var counterPickList = $("#" + counterpickListId);
			var heroListShouldExist = getHeroListShouldExist.bind(this)();
			var heroListExists = heroList.length !== 0;
			if ((heroListShouldExist && !heroListExists) || counterPickList.length === 0) {
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
			initializeHeroList.bind(this)();

			$(".typeahead").typeahead({
					hint: true,
					highlight: true,
					minLength: 1
				},
				{
					name: 'allHeroNames',
					displayKey: 'value',
					source: substringMatcher(allHeroNames)
				});
			initialized = true;
		}.bind(this), 100);
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
		if (!initialized ) {
			return;
		}
		var siteVM = ko.dataFor($("body")[0]);
		var heroListShouldExist = getHeroListShouldExist.bind(siteVM)();
		if(!siteVM.heroListInitialized() || !heroListShouldExist){
			addHeroIfOneLeft();
			return;
		}
		var heroList = $("#" + heroListId);
		var filter = heroList.find(".mix").filter(function () {
			var hero = ko.dataFor(this);
			return filterHeroBySearchText(hero);
		});
		heroList.mixItUp("filter", filter, addHeroIfOneLeft);
	}

	function onSearchTextUpdated() {
		refreshHeroList();
	}

	function substringMatcher(strs) {
		return function findMatches(q, cb) {
			var matches, substrRegex;

			// an array that will be populated with substring matches
			matches = [];

			// regex used to determine if a string contains the substring `q`
			substrRegex = new RegExp(q, 'i');

			// iterate through the pool of strings and for any string that
			// contains the substring `q`, add it to the `matches` array
			$.each(strs, function(i, str) {
				if (substrRegex.test(str)) {
					// the typeahead jQuery plugin expects suggestions to a
					// JavaScript object, refer to typeahead docs for more info
					matches.push({ value: str });
				}
			});

			cb(matches);
		};
	}

	function emptySlots(heroArray){
		return heroArray.reduce(function(sum, hero){
			return hero.empty ? sum+1 : sum;
		}, 0);
	}

	function setCurrentSize(){
		var windowWidth = $(window).width();
		var currentSize = sizes.find(function(size){
			return size.value(windowWidth);
		});
		this.currentSize(currentSize);

		if(resizeRefreshTimeout !== undefined){
			clearTimeout(resizeRefreshTimeout);
		}
		resizeRefreshTimeout = setTimeout(function(){
			clearTimeout(resizeRefreshTimeout);
			var heroListShouldExist = getHeroListShouldExist.bind(this)();
			if(!heroListShouldExist && this.heroListInitialized()){
				this.heroListInitialized(false);
			}
			if(heroListShouldExist && !this.heroListInitialized()){
				initializeHeroList.bind(this)();
			}
			refreshHeroList();
			refreshCounterPicks();
		}.bind(this), 500);

	}

	function initializeHeroList(){
		var heroList = $("#" + heroListId);
		var counterPickList = $("#" + counterpickListId);
		if (heroList.length === 0) {
			return;
		}
		if(heroList.mixItUp("isLoaded")){
			heroList.mixItUp("destroy");
		}

		heroList.mixItUp({
			controls: {
				enable: false
			}
		});
		heroList.mixItUp("sort", "name: desc");
		this.heroListInitialized(true);
	}

	function addHeroIfOneLeft(){
		var siteVM = ko.dataFor($("body")[0]);
		var shownHeroes = siteVM.heroes().filter(filterHeroBySearchText);
		if (shownHeroes.length !== 1 || emptySlots(siteVM.enemyHeroes()) === 0) {
			return;
		}
		if (shownHeroes[0].selected()) {
			return;
		}
		shownHeroes[0].selected(true);
		siteVM.enemyHeroes.pop();
		siteVM.enemyHeroes.unshift(shownHeroes[0]);
		updateCounterPicks.bind(siteVM)();
	}

	function getHeroListShouldExist(){
		return this.currentSize() !== undefined && this.currentSize().name !== "small" && this.currentSize().name !== "tiny";
	}

	$(window).resize(function(){
		var siteVM = ko.dataFor($("body")[0]);
		setCurrentSize.bind(siteVM)();
	});

	return SiteViewModel;
}());