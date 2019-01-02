const fs = require("fs");

const currentFile = "heroFiles/current/savedHeroes.json";
const currentFileDirectory = "heroFiles/current/";
const backupFile = "heroFiles/backup/savedHeroes.json";
const backupFileDirectory = "heroFiles/backup/";

class FileManager {
	currentFileExists() {
		return fs.existsSync(currentFile);
	}

	readCurrentFile() {
		return fs.readFileSync(currentFile);
	}

	writeCurrentfile(data) {
		if (!fs.existsSync(currentFileDirectory)) {
			fs.mkdirSync(currentFileDirectory);
		}
		return fs.writeFileSync(currentFile, data);
	}

	backupFileExists() {
		return fs.existsSync(backupFile);
	}

	readBackupFile() {
		return fs.readFileSync(backupFile);
	}

	writeBackupfile(data) {
		if (!fs.existsSync(backupFileDirectory)) {
			fs.mkdirSync(backupFileDirectory);
		}
		return fs.writeFileSync(backupFile, data);
	}
}

module.exports = new FileManager();
