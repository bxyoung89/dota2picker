const express = require("express");
const path = require('path');
const FileManager = require("../server-classes/file-manager");

const router = express.Router();

router.get("/", (req, res) => {
	if (!FileManager.currentFileExists() && !FileManager.backupFileExists()) {
		res.sendFile(path.join(__dirname, "../views/maintenance.html"));
		return;
	}
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

router.get("/noMaintenance", (req, res) => {
	res.sendFile(path.join(__dirname, "../views/index.html"));
});

module.exports = router;
