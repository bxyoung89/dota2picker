var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var sugar = require("sugar");
var heroFile = "public/js/heroes.json";
var savedFile = "savedHeroes.json";
var lastWritten = undefined;

router.get('/', function(req, res){
	res.sendfile("views/index.html");
});

router.get("/getHeroes", function(req, res){
	var heroes = [];
	fs.readFile(heroFile, "utf8", function(error, data){
		if(error){
			console.log("Error :", error);
			return;
		}
		console.log(new Date().getTime());
		if(lastWritten !== undefined && (new Date()).getTime() - lastWritten.getTime() < 86400000){
			fs.readFile(savedFile, "utf8", function(error, data){
				if(error){
					console.log(error);
					return error;
				}
				res.send(data);
			});
			return;
		}
		data = JSON.parse(data);
		var validHeroesLength = data.length;
		data.forEach(function(heroData){
			var url = "http://www.dotabuff.com/heroes/"+heroData.id+"/matchups";
			var advantages = [];
			var heroIsValid = true;
			request(url, function(error, response, html){
				if(error){
					validHeroesLength -=1;
					heroIsValid = false;
					return "error";
				}
				var $ = cheerio.load(html);
				$("tbody").filter(function(){
					var table = $(this);
					var rows = table.children();
					rows.each(function(){
						var hero = {};
						var columns = $(this).children();

						var nameColumn = columns[1];
						hero.name = $(nameColumn).text();
						if(hero.name.trim() === "" || hero.name.trim() === heroData.name){
							return;
						}

						var advantageColumn = columns[2];
						hero.advantage = parseFloat($(advantageColumn).text());
						advantages.push(hero);
					});
				});
				if(advantages.length === 0){
					validHeroesLength -=1;
					heroIsValid = false;
				}
			});
			var polling = setInterval(function(){
				if(!heroIsValid){
					clearInterval(polling);
					return;
				}
				if(advantages.length !== validHeroesLength -1){
					return;
				}
				clearInterval(polling);
				heroData.advantages = advantages;
				heroes.push(heroData);
			}, 100);
		});
		var polling = setInterval(function(){
			if(heroes.length !== validHeroesLength){
				//var waitingHeroes = data.filter(function(hero){
				//	return heroes.find(function(h){
				//		return h.id === hero.id;
				//	}) === undefined;
				//});
				//var waitingHeroesString = waitingHeroes.reduce(function(sum, hero){
				//	return sum+ hero.id+" ";
				//}, "waiting on ");
				//console.log(waitingHeroesString);
				return;
			}
			clearInterval(polling);
			var validHeroes = [];
			heroes.forEach(function(hero){
				if(hero.advantages !== undefined){
					validHeroes.push(hero);
				}
			});
			console.log("writing to file");
			fs.writeFile(savedFile, JSON.stringify(validHeroes), function(error){
				if(error){
					console.log(error);
				}
				lastWritten = new Date();

			});
			res.send(validHeroes);
		}, 100);
	});

});


module.exports = router;