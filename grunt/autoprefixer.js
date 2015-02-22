module.exports = {
	all: {
		expand: true,
		flatten: true,
		src: [
			"<%= paths.binCss %>/*.css",
			"!<%= paths.binCss %>/*.min.css"
		],
		dest: "<%=paths.binCss %>/"
	}
};