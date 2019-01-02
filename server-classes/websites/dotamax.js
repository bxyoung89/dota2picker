const cheerio = require("cheerio");

class DotaBuff {
	constructor() {
		this.name = "DotaMax";
		this.id = "dotamax";
	}

	getHeroUrl(hero) {
		const heroId = hero.dotaMaxId === undefined ? hero.id : hero.dotaMaxId;
		return `http://dotamax.com/hero/detail/match_up_anti/${heroId}`;
	}

	parseHeroPageForAdvantages(heroPageHtml, heroData, allHeroes) {
		const $ = cheerio.load(heroPageHtml);
		const advantages = [];

		// eslint-disable-next-line
		$("tbody").filter(function () {
			const table = $(this);
			const rows = table.children();
			rows.each(function () {
				const hero = {};
				const columns = $(this).children();

				const nameColumn = columns[0];
				const heroName = $(nameColumn).find(".hero-name-list").text().trim();
				if (heroName === "" || heroName === heroData.name) {
					return;
				}
				const matchingHero = allHeroes.find(h => h.name === heroName);

				hero.id = matchingHero.id;

				const advantageColumn = $(columns[1]).children()[0];
				hero.a = parseFloat($(advantageColumn).text());
				advantages.push(hero);
			});
		});

		return advantages;
	}
}

module.exports = new DotaBuff();
