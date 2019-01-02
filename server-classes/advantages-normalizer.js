require("sugar");

class AdvantagesNormalizer {
	// this will normalize the number to a -10 to 10 scale
	normalizeNumber(number, min, max) {
		// normalize to 0 to 1;
		const normalized = (number - min) / (max - min);
		// scale to -10 to 10
		return (normalized * 20) - 10;
	}

	getNormalizedAdvantagesPerWebsite(advantagesPerWebsite) {
		const normalizedAdvantages = {};
		Object.keys(advantagesPerWebsite).forEach((websiteId) => {
			const allAdvantageNumbers = Object.keys(advantagesPerWebsite[websiteId]).map(heroId => advantagesPerWebsite[websiteId][heroId]).flatten().map(hero => hero.a);
			// console.log(`${websiteId} type ${Object.keys(allAdvantageNumbers[0]) }`);
			const min = allAdvantageNumbers.reduce((minimum, number) => Math.min(minimum, number), Number.POSITIVE_INFINITY);
			const max = allAdvantageNumbers.reduce((maximum, number) => Math.max(maximum, number), Number.NEGATIVE_INFINITY);
			const newAdvantages = {};
			Object.keys(advantagesPerWebsite[websiteId]).forEach((heroId) => {
				newAdvantages[heroId] = advantagesPerWebsite[websiteId][heroId].map((advantage) => {
					const newAdvantage = {};
					newAdvantage.id = advantage.id;
					newAdvantage.a = this.normalizeNumber(advantage.a, min, max);
					return newAdvantage;
				});
			});
			normalizedAdvantages[websiteId] = newAdvantages;
		});
		return normalizedAdvantages;
	}

	getCombinedAdvantages(advantagesPerWebsite) {
		const normalizedAdvantagesPerWebsite = this.getNormalizedAdvantagesPerWebsite(advantagesPerWebsite);
		const combinedAdvantages = {};
		const advantagesPerHero = {};
		Object.keys(normalizedAdvantagesPerWebsite).forEach((websiteId) => {
			const advantages = normalizedAdvantagesPerWebsite[websiteId];
			Object.keys(advantages).forEach((heroId) => {
				if (advantagesPerHero[heroId] === undefined) {
					advantagesPerHero[heroId] = [];
				}
				advantagesPerHero[heroId].push(advantages[heroId]);
			});
		});

		const numberOfAdvantages = advantagesPerHero[Object.keys(advantagesPerHero)[0]].length;
		Object.keys(advantagesPerHero).forEach((heroId) => {
			const allHeroAdvantages = advantagesPerHero[heroId].flatten();
			const heroCombinedAdvantagesByEnemyHero = {};
			allHeroAdvantages.forEach((advantage) => {
				if (heroCombinedAdvantagesByEnemyHero[advantage.id] === undefined) {
					heroCombinedAdvantagesByEnemyHero[advantage.id] = 0;
				}
				heroCombinedAdvantagesByEnemyHero[advantage.id] += (advantage.a / numberOfAdvantages);
			});
			combinedAdvantages[heroId] = Object.keys(heroCombinedAdvantagesByEnemyHero).map(enemyHeroId => ({
				id: enemyHeroId,
				a: Math.round(heroCombinedAdvantagesByEnemyHero[enemyHeroId] * 1000) / 1000,
			})).sortBy(advantage => 1 - advantage.a);
		});

		return combinedAdvantages;
	}

	getNormalizedHeroes(advantagesPerWebsite, heroData) {
		const combinedAdvantages = this.getCombinedAdvantages(advantagesPerWebsite);
		return heroData.map((hero) => {
			const normalizedHero = {
				...hero,
				advantages: {},
			};
			Object.keys(advantagesPerWebsite).forEach((websiteId) => {
				normalizedHero.advantages[websiteId] = advantagesPerWebsite[websiteId][hero.id];
			});
			normalizedHero.advantages.combined = combinedAdvantages[hero.id];
			return normalizedHero;
		});
	}
}

module.exports = new AdvantagesNormalizer();
