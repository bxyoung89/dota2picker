// https://www.evanmiller.org/how-not-to-sort-by-average-rating.html
const wilsonScore = (up, down) => {
	if (!up) return 0;
	const n = up + down;
	const z = 1.64485; // 1.0 = 85%, 1.6 = 95%
	const phat = up / n;
	return (
		phat + ((z * z) / (2 * n)) - (z * Math.sqrt(((phat * (1 - phat)) + (z * z / (4 * n))) / n))
	) / (
		1 + (z * z / n)
	);
};

const getAdvantage = ({ games_played, wins }) => Math.round(wilsonScore(wins, games_played - wins) * 100);

class OpenDota {
	constructor() {
		this.name = "OpenDota";
		this.id = "opendota";
	}

	getHeroUrl(hero) {
		const { openDotaId } = hero;
		return `https://api.opendota.com/api/heroes/${openDotaId}/matchups?`;
	}

	parseHeroPageForAdvantages(heroPageHtml, heroData, allHeroes) {
		// const $ = cheerio.load(heroPageHtml);
		return heroPageHtml.map((advantageItem) => {
			const { hero_id } = advantageItem;
			const matchingHero = allHeroes.find(hero => Number.parseInt(hero.openDotaId) === hero_id);
			if (!matchingHero) {
				console.log(JSON.stringify(advantageItem));
				return;
			}
			return {
				a: getAdvantage(advantageItem),
				id: matchingHero.id,
			};
		});
	}
}

module.exports = new OpenDota();
