module.exports = {
	options: {
		//sourceMap: true
	},
	dev: {
		src: [
			".tmp/dev-templates.js",
			"<%= paths.appSrc %>/walrusPunchApp.js",
			"<%= paths.appSrc %>/services/**/*.js",
			"<%= paths.appSrc %>/features/**/*.js"
		],
		dest: "<%= paths.binJs %>/walrusPunch.js"
	},
	lib: {
		src: [
			"<%= bowerJsFiles.angular %>",
			"<%= bowerJsFiles.angularCountTo %>",
			"<%= bowerJsFiles.angularRoute %>",
			"<%= bowerJsFiles.angularytics %>",
			"<%= bowerJsFiles.ngStorage %>",
			"<%= bowerJsFiles.jquery %>",
			"<%= bowerJsFiles.mixitup %>",
			"<%= bowerJsFiles.sugar %>",
			"<%= bowerJsFiles.typeahead %>"
		],
		dest: "<%= paths.binJs %>/lib.js"
	}
};