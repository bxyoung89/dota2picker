const express = require("express");
const FileManager = require("../server-classes/file-manager");

const router = express.Router();

router.get("/", (req, res) => {
	if (!FileManager.currentFileExists() && !FileManager.backupFileExists()) {
		res.sendfile("views/maintenance.html");
		return;
	}
	res.sendfile("views/index.html");
});

router.get("/noMaintenance", (req, res) => {
	res.sendfile("views/index.html");
});

module.exports = router;
