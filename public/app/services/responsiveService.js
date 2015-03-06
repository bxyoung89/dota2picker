angular.module("WalrusPunch").service("responsiveService", ["$rootScope", "RESIZE_EVENTS", "dota1Service", function ($rootScope, RESIZE_EVENTS, dota1Service) {

	var sizes = [
		{
			name: "tiny",
			value: function (width) {
				return width < 500;
			}
		},
		{
			name: "small",
			value: function (width) {
				return width < 805 && width > 500;
			}
		},
		{
			name: "medium",
			value: function (width) {
				return width < 1100 && width >= 805;
			}
		},
		{
			name: "large",
			value: function (width) {
				return width >= 1100;
			}
		}
	];


	function ResponsiveService() {
		$(window).resize(function(){
			$rootScope.$broadcast(RESIZE_EVENTS.resized);
		});
	}


	ResponsiveService.prototype.getSize = function () {
		var currentSize = getCurrentSize();
		return currentSize === undefined ? "tiny" :currentSize.name;
	};

	ResponsiveService.prototype.getHeroImageSmall = function(hero){
		if(dota1Service.isInDota1Mode()){
			return "/images/dota1/"+hero.dota1Image;
		}
		var size = ResponsiveService.prototype.getSize();
		switch(size){
			case "tiny": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
			case "small": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
			case "medium": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
			case "large": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
			default: return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
		}
	};

	ResponsiveService.prototype.getHeroImageLarge = function(hero){
		if(dota1Service.isInDota1Mode()){
			return "/images/dota1/"+hero.dota1Image;
		}
		var size = ResponsiveService.prototype.getSize();
		switch(size){
			case "tiny": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
			case "small": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
			case "medium": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_lg.png";
			case "large": return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_full.png";
			default: return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_sb.png";
		}
	};

	function getCurrentSize() {
		var windowWidth = $(window).width();
		return sizes.find(function (size) {
			return size.value(windowWidth);
		});
	}

	return new ResponsiveService();
}]);