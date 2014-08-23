var SiteViewModel = (function(){

	function SiteViewModel(){
		this.heroes = new ko.observableArray(heroes);
		this.heroes().forEach(function(hero){
			if(hero.id === undefined){
				return;
			}
			$.get("http://www.dotabuff.com/heroes/"+hero.id+"/matchups", function(data){
				debugger;
			});
		})

	}


	return SiteViewModel;
}());