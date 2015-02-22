module.exports = {
	dev: {
		src: [
			"<%= paths.appSrc %>/features/**/*.html"
		],
		dest: ".tmp/dev-templates.js",
		options: {
			module: "Templates",
			base: "public",
			htmlmin: {
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				removeComments: true,
				removeEmptyAttributes: true,
				removeRedundantAttributes: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true
			}
		}
	}

};