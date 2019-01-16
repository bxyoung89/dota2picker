const axios = require("axios");
const randomUserAgent = require("random-useragent");

const requestWithDelay = (heroData, website, delay) => new Promise((resolve) => {
	setTimeout(() => {
		const url = website.getHeroUrl(heroData);
		axios.get(url, {
			headers: {
				"User-Agent": randomUserAgent.getRandom(),
				"Accept-Language": "en",
			},
		}).then((data) => {
			resolve(data);
		})
			.catch((error) => {
				console.log(error);
			});
	}, delay);
});

class WebsiteScraper {
	async getRawHtmlFromWebsite(heroData, website) {
		const heroHtmlMap = {};
		for (const hero of heroData) {
			const heroHtmlResponse = await requestWithDelay(hero, website, 2000 + (Math.random() * 1000));
			heroHtmlMap[hero.id] = heroHtmlResponse.data;
			console.log(`get html from website: got ${hero.id}`);
		}

		console.log("get html from website: finished");
		return heroHtmlMap;
	}

	async getAdvantagesFromWebsite(heroData, website) {
		const heroIdToHtmlMap = await this.getRawHtmlFromWebsite(heroData, website);
		const heroIdToAdvantagesMap = {};
		heroData.forEach((hero) => {
			heroIdToAdvantagesMap[hero.id] = website.parseHeroPageForAdvantages(heroIdToHtmlMap[hero.id], hero, heroData);
		});

		return heroIdToAdvantagesMap;
	}
}

module.exports = new WebsiteScraper();
