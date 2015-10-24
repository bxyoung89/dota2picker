module.exports = {
	all: {
		expand: true,
		flatten: true,
		processors: [
			require("autoprefixer")({browsers: "last 5 versions"})
		],
		src: [
			"<%= paths.binCss %>/*.css",
			"!<%= paths.binCss %>/*.min.css"
		],
		dest: "<%=paths.binCss %>/"
	}
};