const express = require("express");

const router = express.Router();
const fs = require("fs");
const url = require("url");


const translationNameToFileMap = {
	english: "translations/english.json",
	french: "translations/french.json",
	german: "translations/german.json",
	japanese: "translations/japanese.json",
	korean: "translations/korean.json",
	portuguese: "translations/portugese.json",
	russian: "translations/russian.json",
	simplifiedChinese: "translations/simplifiedChinese.json",
	spanish: "translations/spanish.json",
	traditionalChinese: "translations/traditionalChinese.json",
};

router.get("/", (req, res) => {
	const urlParts = url.parse(req.url, true);
	const { query } = urlParts;
	const translationPath = translationNameToFileMap[query.language] || translationNameToFileMap.english;
	fs.readFile(translationPath, "utf8", (error, data) => {
		if (error) {
			console.log("Error getting translations :", error);
			res.send({
				error: "Could not load translation.",
			});
			return;
		}
		res.send(data);
	});
});

module.exports = router;
