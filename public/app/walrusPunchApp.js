angular.module("WalrusPunch", ["Templates", "ngRoute", "ngStorage", "countTo", "angularytics"])
	.config(["$routeProvider", function($routeProvider){
		$routeProvider.when("/", {
			templateUrl: "/app/features/counterPickerPage/counterPickerPage.html",
			controller: "counterPickerPageController",
			reloadOnSearch: false
		});
		$routeProvider.when("/about", {
			templateUrl: "/app/features/aboutPage/aboutPage.html",
			controller: "aboutPageController",
			reloadOnSearch: false
		});
		$routeProvider.otherwise({redirectTo: "/"});
	}])
	.config(function (AngularyticsProvider){
		AngularyticsProvider.setEventHandlers(["GoogleUniversal"]);
	})
	.constant("MODAL_EVENTS", {
		showAboutModal: "showAboutModal"
	})
	.constant("TRANSLATION_EVENTS", {
		translationChanged: "translationChanged"
	})
	.constant("RESIZE_EVENTS", {
		resized: "resized"
	})
	.constant("HAMBURGER_EVENTS", {
		open: "open",
		close: "close"
	})
	.run([ "Angularytics", function(Angularlytics){
			Angularlytics.init();
		}
	]);