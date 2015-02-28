module.exports = {
	sass: {
		files: [
			"<%= paths.cssSrc %>/**/*.scss",
			"<%= paths.appSrc %>/features/**/*.scss"
		],
		tasks: ["build-css-dev"]
	},
	js: {
		files: [
			"<%= paths.appSrc %>/**/*.js",
			"<%= paths.appSrc %>/**/*.html"
		],
		tasks: ["build-js-dev"]
	}
};