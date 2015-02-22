module.exports = {
	all: {
		files: [{
			expand: true,
			cwd: "<%= paths.binJs %>",
			src: ["*.js", "!*.min.js"],
			dest: "<%= paths.binJs %>",
			ext: ".min.js",
			extDot: "last"
		}]
	},
	dev: {
		files: [{
			expand: true,
			cwd: "<%= paths.binJs %>",
			src: ["walrusPunchApp.js"],
			dest: "<%= paths.binJs %>",
			ext: ".min.js",
			extDot: "last"
		}]
	},
	lib: {
		files: [{
			expand: true,
			cwd: "<%= paths.binJs %>",
			src: ["lib.js"],
			dest: "<%= paths.binJs %>",
			ext: ".min.js",
			extDot: "last"
		}]
	}
};