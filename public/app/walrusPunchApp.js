angular.module("WalrusPunch", ["Templates", "ngRoute", "ngStorage", "countTo", "angularytics"])
	.config(["$routeProvider", function($routeProvider){
		$routeProvider.when("/", {
			templateUrl: "/app/features/counterPickerPage/counterPickerPage.html",
			controller: "counterPickerPageController",
			reloadOnSearch: false
		});
		$routeProvider.otherwise({redirectTo: "/"});
	}])
	.config(function (AngularyticsProvider){
		AngularyticsProvider.setEventHandlers(["GoogleUniversal"]);
	})
	.constant("MODAL_EVENTS", {
		showAboutModa: "showAboutModal"
	})
	.run([ "Angularytics", function(Angularlytics){
			Angularlytics.init();
		}
	]);