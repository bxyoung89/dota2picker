angular.module("WalrusPunch").service("responsiveService", ["$rootScope", "RESIZE_EVENTS", function ($rootScope, RESIZE_EVENTS) {

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

	function getCurrentSize() {
		var windowWidth = $(window).width();
		return sizes.find(function (size) {
			return size.value(windowWidth);
		});
	}

	return new ResponsiveService();
}]);