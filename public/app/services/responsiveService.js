angular.module("WalrusPunch").service("responsiveService", ["$rootScope", function ($rootScope) {

	var size = "";
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
		$(document).ready(getCurrentSize);
	}

	$rootScope.$watch(getCurrentSize(),
		function (sizeName) {
			size = sizeName;
		});


	ResponsiveService.prototype.getSize = function () {
		return size;
	};

	function getCurrentSize() {
		var windowWidth = $(window).width();
		return sizes.find(function (size) {
			return size.value(window);
		});
	}


	return new ResponsiveService();
}]);