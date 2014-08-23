var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var heroFile = "public/js/heroes.json";

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
		data = JSON.parse(data);
		data.forEach(function(heroData){
			var url = "http://www.dotabuff.com/heroes/"+heroData.id+"/matchups";
			var advantages = [];
			request(url, function(error, response, html){
				if(error){
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

						var advantageColumn = columns[2];
						hero.advantage = parseFloat($(advantageColumn).text());
						advantages.push(hero);
					});
				});
			});
			var polling = setInterval(function(){
				if(advantages.length !== data.length -1){
					return;
				}
				clearInterval(polling);
				heroData.advantages = advantages;
				heroes.push(heroData);
			}, 100);
		});
		var polling = setInterval(function(){
			if(heroes.length !== data.length){
				return;
			}
			clearInterval(polling);
			res.send(heroes);
		}, 100);
	});

});


module.exports = router;