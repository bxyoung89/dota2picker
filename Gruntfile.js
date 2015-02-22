module.exports = function (grunt) {

	var base = "public";
	var bowerFolder = "public/js/lib/bowerDependencies";

	// Load grunt tasks automatically
	require("load-grunt-config")(grunt, {
		data: {
			paths: {
				base: base,
				bin: base + "/bin",
				binJs: base + "/bin/js",
				binCss: base + "/bin/css",

				cssSrc: base + "/css",
				jsSrc: base + "/js",

				appSrc: base +"/app",

				libJsSrc: base + "/js/lib"
			},
			bowerJsFiles: {
				angular: bowerFolder+"/angular/angular.js",
				angularCountTo: bowerFolder+"/angular-count-to/index.js",
				angularRoute: bowerFolder+"/angular-route/angular-route.js",
				angularytics: bowerFolder+"/angularytics/dist/angularytics.js",
				jquery: bowerFolder+"/jquery/dist/jquery.js",
				mixitup: bowerFolder+"/mixitup/build/jquery.mixitup.min.js",
				ngStorage: bowerFolder+"/ngStorage/ngStorage.min.js",
				sugar: bowerFolder+"/sugar/release/sugar-full.min.js",
				typeahead: bowerFolder+"/typeahead.js/dist/typeahead.jquery.min.js"
			}
		}
	});
};