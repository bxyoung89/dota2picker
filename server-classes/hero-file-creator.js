const fs = require("fs");
const websites = require("./websites");
const WebsiteScraper = require("./website-scraper");
const FileManager = require("./file-manager");
const AdvantagesNormalizer = require("./advantages-normalizer");


class HeroFileCreator {
	async writeLatestDataToFile() {
		const baseHeroData = JSON.parse(fs.readFileSync("heroFiles/base/heroes.json", "utf8"));
		// const baseHeroData = JSON.parse(fs.readFileSync("heroFiles/base/one-hero.json", "utf8"));
		const advantagesPerWebsite = {};
		for (const website of websites) {
			const advantageForWebsite = await WebsiteScraper.getAdvantagesFromWebsite(baseHeroData, website);
			advantagesPerWebsite[website.id] = advantageForWebsite;
		}

		const normalizedHeroes = AdvantagesNormalizer.getNormalizedHeroes(advantagesPerWebsite, baseHeroData);
		FileManager.writeCurrentfile(JSON.stringify(normalizedHeroes));
		console.log("finished writing data to current file");
	}
}

module.exports = new HeroFileCreator();
