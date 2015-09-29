angular.module("WalrusPunch", ["Templates", "ngRoute", "countTo", "angularytics"])
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
	.constant("HERO_EVENTS", {
		heroesUpdated: "heroesUpdated"
	})
	.constant("DATASOURCE_EVENTS", {
		dataSourceChanged: "dataSourceChanged"
	})
	.constant("HAMBURGER_EVENTS", {
		open: "open",
		close: "close"
	})
	.constant("ENEMY_TEAM_CHANGED", {
		enemyTeamChanged: "enemyTeamChanged"
	})
	.run([ "Angularytics", function(Angularlytics){
			Angularlytics.init();
		}
	]);