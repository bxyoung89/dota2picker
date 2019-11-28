const express = require("express");
const FileManager = require("../server-classes/file-manager");

const router = express.Router();

router.get("/", (req, res) => {
	if (!FileManager.currentFileExists() && !FileManager.backupFileExists()) {
		res.sendFile("views/maintenance.html");
		return;
	}
	res.sendFile("views/index.html");
});

router.get("/noMaintenance", (req, res) => {
	res.sendFile("views/index.html");
});

module.exports = router;
