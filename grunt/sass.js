module.exports = {
	all: {
		options: {
			outputStyle: "nested"
		},
		files: [
			{
				expand: true,
				cwd: "<%= paths.cssSrc %>",
				src: ["*.scss"],
				dest: "<%= paths.binCss %>",
				ext: ".css"
			}
		]
	}
};