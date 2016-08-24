var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sugar = require("sugar");
var heroFile = "heroFiles/base/heroes.json";
var url = require('url');
var mkdirp = require("mkdirp");
var randomUserAgent = require("random-useragent");
var currentFile = "heroFiles/current/savedHeroes.json";
var backupPath = "heroFiles/backup/";
var backupFile = "savedHeroes";
var numberOfBackups = 0;
var lastWritten = undefined;
var useBackup = false;
var writing = false;
var heroFileDirectoriesExist = false;
var heroFileDirectories = [
	"backup",
	"current"
];

var dataWebsites = [
	{
		name: "DotaBuff",
		id: "dotabuff",
		rawId: "rawDotabuff",
		heroUrl: function(hero){
			return "http://www.dotabuff.com/heroes/" + hero.id + "/matchups";
		},
		htmlParser: parseDotaBuffHtmlForAdvantages
	}//,
	//{
	//	name: "DotaMax",
	//	id: "dotamax",
	//	rawId: "rawDotamax",
	//	heroUrl: function(hero){
	//		var heroId = hero.dotaMaxId === undefined ? hero.id : hero.dotaMaxId;
	//		return "http://dotamax.com/hero/detail/match_up_anti/" + heroId ;
	//	},
	//	htmlParser: parseDotaMaxHtmlForAdvantages
	//}
];

router.get('/', function (req, res) {
	if(!currentFileExists() && !backupExists()){
		res.sendfile("views/maintenance.html");
		return;
	}
	res.sendfile("views/index.html");
});

router.get('/noMaintenance', function(req, res){
	res.sendfile("views/index.html");
});

router.get("/getAdvantages", function (req, res) {
	var backupFileExists = backupExists();
	//Case for using the backup file if things go bad
	if (useBackup && backupFileExists) {
		console.log("Sending Backup");
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
			console.log(data);
			res.send(data);
		});
		sentResponse = true;
	}

	var lastWrittenLessThanADayAgo = lastWritten !== undefined && (new Date()).getTime() - lastWritten.getTime() < 86400000;

	//If the data is less than a day old, we're done
	if (sentResponse && backupFileExists && lastWrittenLessThanADayAgo) {
		return;
	}

	if(writing && !sentResponse){
		console.log("waiting on writing current file");
		res.send([]);
		return;
	}

	console.log("writing current file");
	writing = true;
	useBackup = true;

	//Otherwise we need to get the new data

	//we need to say we've written now, so even if we've failed it tries again the next day
	lastWritten = new Date();

	console.log("writing to backup first");
	writeCurrentFileToBackup();

	console.log("reading from file");
	fs.readFile(heroFile, "utf8", function (error, data) {
		if (error) {
			console.log("Error trying to read heroes file: " + error);
			return;
		}
		data = JSON.parse(data);
		var advantagesPerProvider = {};
		var invalidHeroesPerProvider = {};
		dataWebsites.forEach(function(website){
			advantagesPerProvider[website.id] = {};
			invalidHeroesPerProvider[website.id] = [];
		});
		var validHeroesLength = data.length;
		var doneComputingAdvantages = false;

		data.forEach(function (heroData, heroIndex) {
			dataWebsites.forEach(function(website){
				var url = website.heroUrl(heroData);
				var advantages = [];
				var heroIsValid = true;
				var requestOptions = {
					url: url,
					headers: {
						"User-Agent": randomUserAgent.getRandom(),
						"Accept-Language": "en"
					}
				};
				var numberOfTimeouts = 0;
				function handleRequestReturn(error, response, html) {
					if (error) {
						console.log("got an error");
						console.log(error);
						if(numberOfTimeouts < 5){
							numberOfTimeouts +=1;
							console.log("trying again: "+numberOfTimeouts+" times tried");
							setTimeout(function(){
								request(requestOptions, handleRequestReturn);
							}, 2000);
							return;
						}
						heroIsValid = false;
						invalidHeroesPerProvider[website.id].push(heroData.id);
						validHeroesLength = getValidHeroesLength(data, invalidHeroesPerProvider);
					}
					advantages = website.htmlParser(html, heroData, data);
					if(advantages.length !== data.length -1){
						if(numberOfTimeouts < 5){
							numberOfTimeouts +=1;
							setTimeout(function(){
								request(requestOptions, handleRequestReturn);
							}, 2000);
							return;
						}
						heroIsValid = false;
						invalidHeroesPerProvider[website.id].push(heroData.id);
						validHeroesLength = getValidHeroesLength(data, invalidHeroesPerProvider);
					}
				}

				setTimeout(function(){
					request(requestOptions, handleRequestReturn);
				}, heroIndex * 3000);

				var lastHerolength = 0;

				var polling = setInterval(function () {
					if (!heroIsValid) {
						clearInterval(polling);
						return;
					}
					if (advantages.length !== validHeroesLength - 1) {
						if(advantages.length !== lastHerolength){
							lastHerolength = advantages.length;
						}
						return;
					}
					clearInterval(polling);
					advantagesPerProvider[website.id][heroData.id] = advantages.sortBy(function(advantage){
						return 1 - advantage.a;
					});
					doneComputingAdvantages = isDoneComputingAdvantages(validHeroesLength, advantagesPerProvider, data);
				}, 100);
			});
		});
		var oldHeroesWaitingOn = [];
		var polling = setInterval(function () {
			//console.log("Done computing advantages:" +doneComputingAdvantages);
			if (!doneComputingAdvantages) {
				var heroesWaitingOn = data.map(function(hero){
					return hero.id;
				}).subtract(getCompleteHerosIds(advantagesPerProvider, data));
				if(JSON.stringify(oldHeroesWaitingOn) !== JSON.stringify(heroesWaitingOn) ){
					oldHeroesWaitingOn = heroesWaitingOn;
					console.log("waiting on "+JSON.stringify(heroesWaitingOn));
					dataWebsites.forEach(function(website){
						console.log(website.name +" has "+Object.keys(advantagesPerProvider[website.id]).length+" heroes");
					});
				}
				return;
			}
			clearInterval(polling);
			console.log("All websites have completed!");
			var completeHeroesIds = getCompleteHerosIds(advantagesPerProvider, data);
			console.log("got complete hero ids");
			var heroes = [];
			var combinedAdvantages = getCombinedAdvantages(advantagesPerProvider);
			console.log("got combined advantages");
			completeHeroesIds.forEach(function(heroId){
				var hero = data.find(function(h){
					return h.id === heroId;
				});
				hero.advantages = {};
				Object.keys(advantagesPerProvider).forEach(function(websiteId){
					hero.advantages[websiteId] = advantagesPerProvider[websiteId][heroId];
				});
				hero.advantages.combined = combinedAdvantages[hero.id];
				heroes.push(hero);
			});
			console.log("got advantages writing to current file");
			writeToCurrentFile(heroes);
			useBackup = false;
			if (!sentResponse) {
				res.send(heroes);
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
	checkDirectoriesExist();
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
	checkDirectoriesExist();
	fs.writeFile(currentFile, JSON.stringify(heroes), function (error) {
		if (error) {
			console.log(error);
			return;
		}
		useBackup = false;
		console.log("Writing current file!");
	});
}

function parseDotaBuffHtmlForAdvantages(html, heroData, allHeroes) {
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
			hero.a = parseFloat($(advantageColumn).text());
			advantages.push(hero);
		});
	});

	return advantages;
}

function parseDotaMaxHtmlForAdvantages(html, heroData, allHeroes) {
	var $ = cheerio.load(html);
	var advantages = [];

	$("tbody").filter(function () {
		var table = $(this);
		var rows = table.children();
		rows.each(function () {
			var hero = {};
			var columns = $(this).children();

			var nameColumn = columns[0];
			var heroName = $(nameColumn).find(".hero-name-list").text().trim();
			if (heroName === "" || heroName === heroData.name) {
				return;
			}
			var matchingHero = allHeroes.find(function (h) {
				return h.name === heroName;
			});

			hero.id = matchingHero.id;

			var advantageColumn = $(columns[1]).children()[0];
			hero.a = parseFloat($(advantageColumn).text());
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

function getValidHeroesLength(allHeroes, invalidHeroesPerProvider){
	var allHeroesIds = allHeroes.map(function(hero){
		return hero.id;
	});
	var matchingInvalidHeroes = Object.keys(invalidHeroesPerProvider).reduce(function(sum, invalidHeroes){
		return sum.intersect(invalidHeroes);
	}, allHeroesIds);

	return allHeroes.length - matchingInvalidHeroes.length;
}

function isDoneComputingAdvantages(validHeroesLength, advantagesPerProvider, allHeroes){
	return validHeroesLength === getCompleteHerosIds(advantagesPerProvider,allHeroes).length;
}

function getCompleteHerosIds(advantagesPerProvider, allHeroes){
	var allHeroesIds = allHeroes.map(function(hero){
		return hero.id;
	});
	var advantagesPerProviderNameArray = Object.keys(advantagesPerProvider).map(function(key){
		return Object.keys(advantagesPerProvider[key]).map(function(heroId){
			return heroId;
		});
	});
	var matchingCompleteHeroes = advantagesPerProviderNameArray.reduce(function(sum, nameArray){
		return sum.intersect(nameArray);
	}, allHeroesIds);

	return matchingCompleteHeroes;
}

function getNormalizedAdvantagesPerProvider(advantagesPerProvider){
	var normalizedAdvantages = {};
	Object.keys(advantagesPerProvider).forEach(function(websiteId){
		var allAdvantageNumbers = Object.keys(advantagesPerProvider[websiteId]).map(function(heroId){
			return advantagesPerProvider[websiteId][heroId];
		}).flatten();
		var uniqueAdvantageNumbers = allAdvantageNumbers.flatten().map(function(advantage){
			return advantage.a;
		}).unique();
		var min = uniqueAdvantageNumbers.min();
		var max = uniqueAdvantageNumbers.max();
		var newAdvantages = {};
		Object.keys(advantagesPerProvider[websiteId]).map(function(heroId){
			newAdvantages[heroId] = advantagesPerProvider[websiteId][heroId].map(function(advantage){
				var newAdvantage = {};
				newAdvantage.id = advantage.id;
				newAdvantage.a =  normalizeNumber(advantage.a, min, max);
				return newAdvantage;
			});
		});
		normalizedAdvantages[websiteId] = newAdvantages;
	});
	return normalizedAdvantages;
}

//this will normalize the number to a -10 to 10 scale
function normalizeNumber(number, min, max){
	//normalize to 0 to 1;
	var normalized = (number - min)/(max - min);
	//scale to -10 to 10
	var scaled = (normalized * 20) - 10;
	return scaled;
}

function getCombinedAdvantages(advantagesPerProvider){
	var normalizedAdvantagesPerProvider = getNormalizedAdvantagesPerProvider(advantagesPerProvider);
	var combinedAdvantages = {};
	var advantagesPerHero = {};
	Object.keys(normalizedAdvantagesPerProvider).forEach(function(websiteId){
		var advantages = normalizedAdvantagesPerProvider[websiteId];
		Object.keys(advantages).forEach(function(heroId){
			if(advantagesPerHero[heroId] === undefined){
				advantagesPerHero[heroId] = [];
			}
			advantagesPerHero[heroId].push(advantages[heroId]);
		});
	});

	var numberOfAdvantages = advantagesPerHero[Object.keys(advantagesPerHero)[0]].length;
	Object.keys(advantagesPerHero).forEach(function(heroId){
		var allHeroAdvantages = advantagesPerHero[heroId].flatten();
		var heroCombinedAdvantagesByEnemyHero = {};
		allHeroAdvantages.forEach(function(advantage){
			if(heroCombinedAdvantagesByEnemyHero[advantage.id] === undefined){
				heroCombinedAdvantagesByEnemyHero[advantage.id] = 0;
			}
			heroCombinedAdvantagesByEnemyHero[advantage.id] += (advantage.a/numberOfAdvantages);
		});
		combinedAdvantages[heroId] = Object.keys(heroCombinedAdvantagesByEnemyHero).map(function(enemyHeroId){
			return {
				id: enemyHeroId,
				a: Math.round(heroCombinedAdvantagesByEnemyHero[enemyHeroId] * 1000)/1000
			};
		}).sortBy(function(advantage){
			return 1 - advantage.a;
		});
	});

	return combinedAdvantages;
}

function checkDirectoriesExist(){
	var existsPerDirectory = [];
	heroFileDirectories.forEach(function(directory){
		var path = "heroFiles/"+directory;
		var exists = false;
		try {
			var stats = fs.lstatSync(path);
			exists = stats.isDirectory();
		}
		catch (exception){
			exists = false;
		}
		existsPerDirectory.push(exists);
	});

	existsPerDirectory.forEach(function(exists, index){
		if(exists){
			return;
		}
		mkdirp("heroFiles/"+heroFileDirectories[index], function(err){
			return;
		});
	});
}


module.exports = router;