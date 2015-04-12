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

	ResponsiveService.prototype.getHeroImageCustom = function(sizeMap){
		return function(hero){
			if(dota1Service.isInDota1Mode()){
				return "/images/dota1/"+hero.dota1Image;
			}
			var size = ResponsiveService.prototype.getSize();
			switch(size){
				case "tiny": return getHeroUrl(hero, sizeMap.tiny);
				case "small": return getHeroUrl(hero, sizeMap.small);
				case "medium": return getHeroUrl(hero, sizeMap.medium);
				case "large": return getHeroUrl(hero, sizeMap.large);
				default: return getHeroUrl(hero, sizeMap.tiny);
			}
		};
	};

	ResponsiveService.prototype.getHeroImageSmall = ResponsiveService.prototype.getHeroImageCustom({
		tiny: "small",
		small: "small",
		medium: "large",
		large: "large"
	});
	ResponsiveService.prototype.getHeroImageLarge = ResponsiveService.prototype.getHeroImageCustom({
		tiny: "small",
		small: "small",
		medium: "large",
		large: "full"
	});

	function getCurrentSize() {
		var windowWidth = $(window).width();
		return sizes.find(function (size) {
			return size.value(windowWidth);
		});
	}

	function sizeNameToId(sizeName){
		switch(sizeName){
			case "full": return "full";
			case "large": return "lg";
			case "small": return "sb";
			default: return "sb";
		}
	}

	function getHeroUrl(hero, sizeName){
		return "http://cdn.dota2.com/apps/dota2/images/heroes/" + hero.imageId + "_"+sizeNameToId(sizeName)+".png";
	}

	return new ResponsiveService();
}]);