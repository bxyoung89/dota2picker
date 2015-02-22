module.exports = {
	dev: {
		files: [{
			expand: true,
			cwd: "<%= paths.binJS %>",
			src: ["walrusPunchApp.js"],
			dest: "<%= paths.binJS %>"
		}]
	}
};