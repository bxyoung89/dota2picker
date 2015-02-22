module.exports = {
	all: {
		expand: true,
		cwd: "<%= paths.binCss %>",
		src: [ "*.css", "!*.min.css"],
		dest: "<%= paths.binCss %>",
		ext: ".min.css",
		extDot: "last"
	}
};