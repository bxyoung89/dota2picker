const HeroFileCreator = require("./hero-file-creator");
const FileManager = require("./file-manager");

const dayInMS = 24 * 60 * 60 * 1000;

class AdvantagesCoordinator {
	constructor() {
		this.lastWritten = undefined;
		this.writing = false;
		if (!FileManager.currentFileExists()) {
			this.createCurrentFile();
		}
	}

	async createCurrentFile() {
		this.writing = true;
		await HeroFileCreator.writeLatestDataToFile();
		this.lastWritten = Date.now();
		this.writing = false;
	}

	updateCurrentFile() {
		this.writeCurrentFileToBackup();
		this.createCurrentFile();
	}

	writeCurrentFileToBackup() {
		const currentFile = FileManager.readCurrentFile();
		FileManager.writeBackupfile(currentFile);
	}

	getAdvantages() {
		if (this.writing) {
			if (FileManager.backupFileExists()) {
				return JSON.parse(FileManager.readBackupFile());
			}
			return [];
		}
		if (this.lastWritten + dayInMS < Date.now()) {
			setTimeout(() => {
				this.updateCurrentFile();
			}, 0);
		}
		if (FileManager.currentFileExists()) {
			return JSON.parse(FileManager.readCurrentFile());
		}
		return [];
	}
}

module.exports = new AdvantagesCoordinator();
