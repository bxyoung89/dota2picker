const cheerio = require("cheerio");
const fs = require("fs");

class DotaBuff {
	constructor() {
		this.name = "DotaBuff";
		this.id = "dotabuff";
	}

	getHeroUrl(hero) {
		return `http://www.dotabuff.com/heroes/${hero.id}/counters`;
	}

	parseHeroPageForAdvantages(heroPageHtml, heroData, allHeroes) {
		console.log(`dotabuff parsing: ${heroData.id}`);

		let $;
		try {
			$ = cheerio.load(heroPageHtml);
		} catch (e) {
			console.log(`failed to parse html for ${heroData.id}`);
			fs.writeFileSync(`${heroData.id}-failed.html`);
			return [];
		}

		const advantages = [];
		// eslint-disable-next-line
		$($("tbody")[3]).filter(function () {
			const table = $(this);
			const rows = table.children();
			rows.each(function () {
				const hero = {};
				const columns = $(this).children();

				const nameColumn = columns[1];
				const heroName = $(nameColumn).text().trim();
				if (heroName === "" || heroName === heroData.name) {
					return;
				}
				const matchingHero = allHeroes.find(h => h.name === heroName);

				hero.id = matchingHero.id;

				const advantageColumn = columns[2];
				hero.a = parseFloat($(advantageColumn).text());
				advantages.push(hero);
			});
		});

		return advantages;
	}
}

module.exports = new DotaBuff();
