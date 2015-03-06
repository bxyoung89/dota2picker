var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sugar = require("sugar");
var heroFile = "heroFiles/base/heroes.json";
var url = require('url');
var currentFile = "heroFiles/current/savedHeroes.json";
var backupPath = "heroFiles/backup/";
var backupFile = "savedHeroes";
var numberOfBackups = 0;
var lastWritten = undefined;
var useBackup = false;

router.get('/', function (req, res) {
	res.sendfile("views/index.html");
});

router.get("/getAdvantages", function (req, res) {
	var backupFileExists = backupExists();
	//Case for using the backup file if things go bad
	if (useBackup && backupFileExists) {
		fs.readFile(backupPath + backupFile + ".json", "utf8", function (error, data) {
			if (error) {
				console.log("Error reading backup :" + error);
				res.send(error);
				return;
			}
			res.send(data);
		});
		return;
	}

	//First send the current file before deciding if we need to process.
	var sentResponse = false;
	if (currentFileExists()) {
		console.log("Reading current file!");
		fs.readFile(currentFile, "utf8", function (error, data) {
			if (error) {
				console.log("Error reading current file: " + error);
				return error;
			}
			res.send(data);
		});
		sentResponse = true;
	}

	var lastWrittenLessThanADayAgo = lastWritten !== undefined && (new Date()).getTime() - lastWritten.getTime() < 86400000;

	//If the data is less than a day old, we're done
	if (sentResponse && backupFileExists && lastWrittenLessThanADayAgo) {
		return;
	}

	//Otherwise we need to get the new data

	//we need to say we've written now, so even if we've failed it tries again the next day
	lastWritten = new Date();

	writeCurrentFileToBackup();

	var heroes = [];
	fs.readFile(heroFile, "utf8", function (error, data) {
		if (error) {
			console.log("Error trying to read heroes file: " + error);
			return;
		}
		data = JSON.parse(data);
		var validHeroesLength = data.length;

		data.forEach(function (heroData) {
			var url = "http://www.dotabuff.com/heroes/" + heroData.id + "/matchups";
			var advantages = [];
			var heroIsValid = true;
			var requestOptions = {
				url: url,
				headers: {
					"User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36"
				}
			};

			request(requestOptions, function (error, response, html) {
				if (error) {
					validHeroesLength -= 1;
					heroIsValid = false;
					console.log("got an error");
					console.log(error);
					return "error";
				}

				advantages = parseHtmlForAdvantages(html, heroData, data);

				if (advantages.length === 0) {
					validHeroesLength -= 1;
					heroIsValid = false;
					return;
				}
			});

			var polling = setInterval(function () {
				if (!heroIsValid) {
					clearInterval(polling);
					return;
				}
				if (advantages.length !== validHeroesLength - 1) {
					return;
				}
				clearInterval(polling);
				heroData.advantages = advantages;
				heroes.push(heroData);
			}, 100);
		});
		var polling = setInterval(function () {
			if (heroes.length !== validHeroesLength) {
				//console.log(heroes.length + " of "+validHeroesLength);
				return;
			}
			clearInterval(polling);
			var validHeroes = [];
			heroes.forEach(function (hero) {
				if (hero.advantages !== undefined) {
					validHeroes.push(hero);
				}
			});
			writeToCurrentFile(validHeroes);
			if (!sentResponse) {
				res.send(validHeroes);
			}
		}, 100);
	});


});

router.get("/getLocale", function (req, res) {
	res.send(req.locale.code);
});

router.get("/getTranslation", function (req, res) {
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	var translationPath = getTranslationPath(query.language);
	fs.readFile(translationPath, "utf8", function (error, data) {
		if (error) {
			console.log("Error getting translations :", error);
			res.send({
				"error": "Could not load translation."
			});
			return;
		}
		res.send(data);
	});
});

function getTranslationPath(translationName) {
	switch (translationName) {
		case "english":
			return "translations/english.json";
		case "french":
			return "translations/french.json";
		case "german":
			return "translations/german.json";
		case "japanese":
			return "translations/japanese.json";
		case "korean":
			return "translations/korean.json";
		case "portuguese":
			return "translations/portugese.json";
		case "russian":
			return "translations/russian.json";
		case "simplifiedChinese":
			return "translations/simplifiedChinese.json";
		case "spanish":
			return "translations/spanish.json";
		case "traditionalChinese":
			return "translations/traditionalChinese.json";
		default:
			return "translations/english.json";
	}
}

function writeCurrentFileToBackup() {
	if(!currentFileExists()){
		return;
	}
	fs.readFile(currentFile, "utf8", function (error, data) {
		if (error) {
			console.log("Error reading current file: " + error);
			return error;
		}

		numberOfBackups += 1;
		backupFile = "savedHeroes" + numberOfBackups;

		fs.writeFile(backupPath + backupFile + ".json", data, function (error) {
			if (error) {
				console.log("Error writing to backup file: " + error);
			}
			useBackup = true;
			console.log("Using backup!");
		});
	});
}

function writeToCurrentFile(heroes) {
	fs.writeFile(currentFile, JSON.stringify(heroes), function (error) {
		if (error) {
			console.log(error);
			return;
		}
		useBackup = false;
		console.log("Using current file!");
	});
}

function parseHtmlForAdvantages(html, heroData, allHeroes) {
	var $ = cheerio.load(html);
	var advantages = [];

	$("tbody").filter(function () {
		var table = $(this);
		var rows = table.children();
		rows.each(function () {
			var hero = {};
			var columns = $(this).children();

			var nameColumn = columns[1];
			var heroName = $(nameColumn).text().trim();
			if (heroName === "" || heroName === heroData.name) {
				return;
			}
			var matchingHero = allHeroes.find(function (h) {
				return h.name === heroName;
			});

			hero.id = matchingHero.id;

			var advantageColumn = columns[2];
			hero.advantage = parseFloat($(advantageColumn).text());
			advantages.push(hero);
		});
	});

	return advantages;
}

function backupExists() {
	return fileExists(backupPath + backupFile + ".json");
}

function currentFileExists() {
	return fileExists(currentFile);
}

function fileExists(filePath) {
	try {
		var stats = fs.lstatSync(filePath);
		return stats.isFile();
	}
	catch (exception) {
		return false;
	}
}


module.exports = router;