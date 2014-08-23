var SiteViewModel = (function(){

	function SiteViewModel(){
		this.state = ko.observable("loading");
		this.enemyHeroes = ko.observableArray([]);
		this.counterPicks = ko.observableArray([]);
		this.heroes = ko.observableArray([]);
	}

	SiteViewModel.prototype.loadHeroes = function(heroes){
		heroes.forEach(function(hero){
			hero.imageUrl = "http://cdn.dota2.com/apps/dota2/images/heroes/"+hero.imageId+"_full.png";
			hero.selected = ko.observable(false);
			hero.counterPickAdvantage = ko.observable(0);
			this.heroes.push(hero);
		}, this);
		this.state("normal");
	};

	SiteViewModel.prototype.heroSelected = function(hero){
		if(this.enemyHeroes().length === 5){
			return;
		}
		if(hero.selected()){
			this.heroRemoved(hero);
			return;
		}
		hero.selected(true);
		this.enemyHeroes.push(hero);
		updateCounterPicks.bind(this)();
	};

	SiteViewModel.prototype.heroRemoved = function(hero){
		if(!hero.selected()){
			return;
		}
		hero.selected(false);
		this.enemyHeroes.remove(function(h){
			return h.id === hero.id;
		});
		updateCounterPicks.bind(this)();
	};

	function updateCounterPicks(){
		var counterPickHeroes = this.heroes().filter(function(hero){
			return !this.enemyHeroes().any(function(h){
				return h.id === hero.id;
			});
		}, this);
		counterPickHeroes.forEach(function(hero){
			var teamAdvantage = this.enemyHeroes().average(function(enemy){
				return hero.advantages.find(function(advantage){
					return advantage.name === enemy.name;
				}).advantage;
			});
			hero.counterPickAdvantage(Math.round(teamAdvantage*1000)/1000);
		}, this);
		counterPickHeroes.sort(function(a, b){
			return b.counterPickAdvantage() - a.counterPickAdvantage();
		});
		this.counterPicks(counterPickHeroes);
	}


	return SiteViewModel;
}());