angular.module("WalrusPunch").service("heroBaseService", function(){
	var heroBases = [
		{
			"name": "Abaddon",
			"id": "abaddon",
			"stat": "strength",
			"imageId": "abaddon",
			"dota1Image": "abaddon.gif"
		},
		{
			"name": "Alchemist",
			"id": "alchemist",
			"stat": "strength",
			"imageId": "alchemist",
			"dota1Image": "alchemist.gif"
		},
		{
			"name": "Ancient Apparition",
			"id": "ancient-apparition",
			"stat": "intelligence",
			"imageId": "ancient_apparition",
			"dota1Image": "acient_apparition.jpg"
		},
		{
			"name": "Anti-Mage",
			"id": "anti-mage",
			"stat": "agility",
			"imageId": "antimage",
			"dota1Image": "anti-mage.gif"
		},
		{
			"name": "Axe",
			"id": "axe",
			"stat": "strength",
			"imageId": "axe",
			"dota1Image": "axe.gif"
		},
		{
			"name": "Bane",
			"id": "bane",
			"stat": "intelligence",
			"imageId": "bane",
			"dota1Image": "bane.gif"
		},
		{
			"name": "Batrider",
			"id": "batrider",
			"stat": "intelligence",
			"imageId": "batrider",
			"dota1Image": "bat_rider.jpeg"
		},
		{
			"name": "Beastmaster",
			"id": "beastmaster",
			"stat": "strength",
			"imageId": "beastmaster",
			"dota1Image": "beast_master.gif"
		},
		{
			"name": "Bloodseeker",
			"id": "bloodseeker",
			"stat": "agility",
			"imageId": "bloodseeker",
			"dota1Image": "bloodseeker.gif"
		},
		{
			"name": "Bounty Hunter",
			"id": "bounty-hunter",
			"stat": "agility",
			"imageId": "bounty_hunter",
			"dota1Image": "bounty_hunter.gif"
		},
		{
			"name": "Brewmaster",
			"id": "brewmaster",
			"stat": "strength",
			"imageId": "brewmaster",
			"dota1Image": "brewmaster.gif"
		},
		{
			"name": "Bristleback",
			"id": "bristleback",
			"stat": "strength",
			"imageId": "bristleback",
			"dota1Image": "bristleback.jpg"
		},
		{
			"name": "Broodmother",
			"id": "broodmother",
			"stat": "agility",
			"imageId": "broodmother",
			"dota1Image": "broodmother.gif"
		},
		{
			"name": "Centaur Warrunner",
			"id": "centaur-warrunner",
			"stat": "strength",
			"imageId": "centaur",
			"dota1Image": "centaur_warrunner.jpg"
		},
		{
			"name": "Chaos Knight",
			"id": "chaos-knight",
			"stat": "strength",
			"imageId": "chaos_knight",
			"dota1Image": "chaos_knight.gif"
		},
		{
			"name": "Chen",
			"id": "chen",
			"stat": "intelligence",
			"imageId": "chen",
			"dota1Image": "chen.gif"
		},
		{
			"name": "Clinkz",
			"id": "clinkz",
			"stat": "agility",
			"imageId": "clinkz",
			"dota1Image": "clinkz.gif"
		},
		{
			"name": "Clockwerk",
			"id": "clockwerk",
			"stat": "strength",
			"imageId": "rattletrap",
			"dota1Image": "clockwerk.gif"
		},
		{
			"name": "Crystal Maiden",
			"id": "crystal-maiden",
			"stat": "agility",
			"imageId": "crystal_maiden",
			"dota1Image": "crystal_maiden.jpg"
		},
		{
			"name": "Dark Seer",
			"id": "dark-seer",
			"stat": "intelligence",
			"imageId": "dark_seer",
			"dota1Image": "dark_seer.gif"
		},
		{
			"name": "Dazzle",
			"id": "dazzle",
			"stat": "intelligence",
			"imageId": "dazzle",
			"dota1Image": "dazzle.gif"
		},
		{
			"name": "Death Prophet",
			"id": "death-prophet",
			"stat": "intelligence",
			"imageId": "death_prophet",
			"dota1Image": "death_prophet.gif"
		},
		{
			"name": "Disruptor",
			"id": "disruptor",
			"stat": "intelligence",
			"imageId": "disruptor",
			"dota1Image": "disruptor.gif"
		},
		{
			"name": "Doom",
			"id": "doom",
			"stat": "strength",
			"imageId": "doom_bringer",
			"dota1Image": "doom.gif"
		},
		{
			"name": "Dragon Knight",
			"id": "dragon-knight",
			"stat": "strength",
			"imageId": "dragon_knight",
			"dota1Image": "dragon_knight.gif"
		},
		{
			"name": "Drow Ranger",
			"id": "drow-ranger",
			"stat": "agility",
			"imageId": "drow_ranger",
			"dota1Image": "drow_ranger.gif"
		},
		{
			"name": "Earth Spirit",
			"id": "earth-spirit",
			"stat": "strength",
			"imageId": "earth_spirit",
			"dota1Image": "earth_spirit.gif"
		},
		{
			"name": "Earthshaker",
			"id": "earthshaker",
			"stat": "strength",
			"imageId": "earthshaker",
			"dota1Image": "earthshaker.gif"
		},
		{
			"name": "Elder Titan",
			"id": "elder-titan",
			"stat": "strength",
			"imageId": "elder_titan",
			"dota1Image": "elder_titan.jpeg"
		},
		{
			"name": "Ember Spirit",
			"id": "ember-spirit",
			"stat": "agility",
			"imageId": "ember_spirit",
			"dota1Image": "ember_spirit.jpg"
		},
		{
			"name": "Enchantress",
			"id": "enchantress",
			"stat": "intelligence",
			"imageId": "enchantress",
			"dota1Image": "enchantress.jpg"
		},
		{
			"name": "Enigma",
			"id": "enigma",
			"stat": "intelligence",
			"imageId": "enigma",
			"dota1Image": "enigma.gif"
		},
		{
			"name": "Faceless Void",
			"id": "faceless-void",
			"stat": "agility",
			"imageId": "faceless_void",
			"dota1Image": "faceless_void.gif"
		},
		{
			"name": "Gyrocopter",
			"id": "gyrocopter",
			"stat": "agility",
			"imageId": "gyrocopter",
			"dota1Image": "gyrocopter.gif"
		},
		{
			"name": "Huskar",
			"id": "huskar",
			"stat": "strength",
			"imageId": "huskar",
			"dota1Image": "huskar.gif"
		},
		{
			"name": "Invoker",
			"id": "invoker",
			"stat": "intelligence",
			"imageId": "invoker",
			"dota1Image": "invoker.gif"
		},
		{
			"name": "Io",
			"id": "io",
			"stat": "strength",
			"imageId": "wisp",
			"dota1Image": "io.jpg"
		},
		{
			"name": "Jakiro",
			"id": "jakiro",
			"stat": "intelligence",
			"imageId": "jakiro",
			"dota1Image": "jakiro.gif"
		},
		{
			"name": "Juggernaut",
			"id": "juggernaut",
			"stat": "agility",
			"imageId": "juggernaut",
			"dota1Image": "juggernaut.gif"
		},
		{
			"name": "Keeper of the Light",
			"id": "keeper-of-the-light",
			"stat": "intelligence",
			"imageId": "keeper_of_the_light",
			"dota1Image": "keeper_of_the_light.jpg"
		},
		{
			"name": "Kunkka",
			"id": "kunkka",
			"stat": "strength",
			"imageId": "kunkka",
			"dota1Image": "kunkka.gif"
		},
		{
			"name": "Legion Commander",
			"id": "legion-commander",
			"stat": "strength",
			"imageId": "legion_commander",
			"dota1Image": "legion_commander.jpg"
		},
		{
			"name": "Leshrac",
			"id": "leshrac",
			"stat": "intelligence",
			"imageId": "leshrac",
			"dota1Image": "leshrac.gif"
		},
		{
			"name": "Lich",
			"id": "lich",
			"stat": "intelligence",
			"imageId": "lich",
			"dota1Image": "lich.gif"
		},
		{
			"name": "Lifestealer",
			"id": "lifestealer",
			"stat": "strength",
			"imageId": "life_stealer",
			"dota1Image": "lifestealer.gif"
		},
		{
			"name": "Lina",
			"id": "lina",
			"stat": "intelligence",
			"imageId": "lina",
			"dota1Image": "lina.jpg"
		},
		{
			"name": "Lion",
			"id": "lion",
			"stat": "intelligence",
			"imageId": "lion",
			"dota1Image": "lion.gif"
		},
		{
			"name": "Lone Druid",
			"id": "lone-druid",
			"stat": "agility",
			"imageId": "lone_druid",
			"dota1Image": "lone_druid.gif"
		},
		{
			"name": "Luna",
			"id": "luna",
			"stat": "agility",
			"imageId": "luna",
			"dota1Image": "luna.gif"
		},
		{
			"name": "Lycan",
			"id": "lycan",
			"stat": "strength",
			"imageId": "lycan",
			"dota1Image": "lycan.gif"
		},
		{
			"name": "Magnus",
			"id": "magnus",
			"stat": "strength",
			"imageId": "magnataur",
			"dota1Image": "magnus.gif"
		},
		{
			"name": "Medusa",
			"id": "medusa",
			"stat": "agility",
			"imageId": "medusa",
			"dota1Image": "medusa.gif"
		},
		{
			"name": "Meepo",
			"id": "meepo",
			"stat": "agility",
			"imageId": "meepo",
			"dota1Image": "meepo.gif"
		},
		{
			"name": "Mirana",
			"id": "mirana",
			"stat": "agility",
			"imageId": "mirana",
			"dota1Image": "mirana.gif"
		},
		{
			"name": "Morphling",
			"id": "morphling",
			"stat": "agility",
			"imageId": "morphling",
			"dota1Image": "morphling.gif"
		},
		{
			"name": "Naga Siren",
			"id": "naga-siren",
			"stat": "agility",
			"imageId": "naga_siren",
			"dota1Image": "naga_siren.gif"
		},
		{
			"name": "Nature's Prophet",
			"id": "natures-prophet",
			"stat": "intelligence",
			"imageId": "furion",
			"dota1Image": "furion.gif"
		},
		{
			"name": "Necrophos",
			"id": "necrophos",
			"stat": "intelligence",
			"imageId": "necrolyte",
			"dota1Image": "necrolyte.gif"
		},
		{
			"name": "Night Stalker",
			"id": "night-stalker",
			"stat": "strength",
			"imageId": "night_stalker",
			"dota1Image": "nightstalker.gif"
		},
		{
			"name": "Nyx Assassin",
			"id": "nyx-assassin",
			"stat": "agility",
			"imageId": "nyx_assassin",
			"dota1Image": "nyx_assasin.gif"
		},
		{
			"name": "Ogre Magi",
			"id": "ogre-magi",
			"stat": "intelligence",
			"imageId": "ogre_magi",
			"dota1Image": "ogre_magi.gif"
		},
		{
			"name": "Omniknight",
			"id": "omniknight",
			"stat": "strength",
			"imageId": "omniknight",
			"dota1Image": "omniknight.gif"
		},
		{
			"name": "Oracle",
			"id": "oracle",
			"stat": "intelligence",
			"imageId": "oracle",
			"dota1Image": "oracle.gif"
		},
		{
			"name": "Outworld Devourer",
			"id": "outworld-devourer",
			"stat": "intelligence",
			"imageId": "obsidian_destroyer",
			"dota1Image": "outworld_devourer.gif"
		},
		{
			"name": "Phantom Assassin",
			"id": "phantom-assassin",
			"stat": "agility",
			"imageId": "phantom_assassin",
			"dota1Image": "phantom_assasin.gif"
		},
		{
			"name": "Phantom Lancer",
			"id": "phantom-lancer",
			"stat": "agility",
			"imageId": "phantom_lancer",
			"dota1Image": "phantom_lancer.gif"
		},
		{
			"name": "Phoenix",
			"id": "phoenix",
			"stat": "strength",
			"imageId": "phoenix",
			"dota1Image": "phoenix.jpg"
		},
		{
			"name": "Puck",
			"id": "puck",
			"stat": "intelligence",
			"imageId": "puck",
			"dota1Image": "puck.gif"
		},
		{
			"name": "Pudge",
			"id": "pudge",
			"stat": "strength",
			"imageId": "pudge",
			"dota1Image": "pudge.gif"
		},
		{
			"name": "Pugna",
			"id": "pugna",
			"stat": "intelligence",
			"imageId": "pugna",
			"dota1Image": "pugna.jpg"
		},
		{
			"name": "Queen of Pain",
			"id": "queen-of-pain",
			"stat": "intelligence",
			"imageId": "queenofpain",
			"dota1Image": "queen_of_pain.gif"
		},
		{
			"name": "Razor",
			"id": "razor",
			"stat": "agility",
			"imageId": "razor",
			"dota1Image": "razor.gif"
		},
		{
			"name": "Riki",
			"id": "riki",
			"stat": "agility",
			"imageId": "riki",
			"dota1Image": "riki.gif"
		},
		{
			"name": "Rubick",
			"id": "rubick",
			"stat": "intelligence",
			"imageId": "rubick",
			"dota1Image": "rubick.jpg"
		},
		{
			"name": "Sand King",
			"id": "sand-king",
			"stat": "strength",
			"imageId": "sand_king",
			"dota1Image": "sand_king.gif"
		},
		{
			"name": "Shadow Demon",
			"id": "shadow-demon",
			"stat": "intelligence",
			"imageId": "shadow_demon",
			"dota1Image": "shadow_demon.jpg"
		},
		{
			"name": "Shadow Fiend",
			"id": "shadow-fiend",
			"stat": "agility",
			"imageId": "nevermore",
			"dota1Image": "shadow_fiend.gif"
		},
		{
			"name": "Shadow Shaman",
			"id": "shadow-shaman",
			"stat": "intelligence",
			"imageId": "shadow_shaman",
			"dota1Image": "shadow_shaman.gif"
		},
		{
			"name": "Silencer",
			"id": "silencer",
			"stat": "intelligence",
			"imageId": "silencer",
			"dota1Image": "silencer.gif"
		},
		{
			"name": "Skywrath Mage",
			"id": "skywrath-mage",
			"stat": "initiator",
			"imageId": "skywrath_mage",
			"dota1Image": "skywrath_mage.jpg"
		},
		{
			"name": "Slardar",
			"id": "slardar",
			"stat": "strength",
			"imageId": "slardar",
			"dota1Image": "slardar.gif"
		},
		{
			"name": "Slark",
			"id": "slark",
			"stat": "agility",
			"imageId": "slark",
			"dota1Image": "slark.gif"
		},
		{
			"name": "Sniper",
			"id": "sniper",
			"stat": "agility",
			"imageId": "sniper",
			"dota1Image": "sniper.gif"
		},
		{
			"name": "Spectre",
			"id": "spectre",
			"stat": "agility",
			"imageId": "spectre",
			"dota1Image": "spectre.gif"
		},
		{
			"name": "Spirit Breaker",
			"id": "spirit-breaker",
			"stat": "strength",
			"imageId": "spirit_breaker",
			"dota1Image": "spiritbreaker.gif"
		},
		{
			"name": "Storm Spirit",
			"id": "storm-spirit",
			"stat": "intelligence",
			"imageId": "storm_spirit",
			"dota1Image": "storm_spirit.gif"
		},
		{
			"name": "Sven",
			"id": "sven",
			"stat": "strength",
			"imageId": "sven",
			"dota1Image": "sven.gif"
		},
		{
			"name": "Techies",
			"id": "techies",
			"stat": "intelligence",
			"imageId": "techies",
			"dota1Image": "techies.gif"
		},
		{
			"name": "Templar Assassin",
			"id": "templar-assassin",
			"stat": "agility",
			"imageId": "templar_assassin",
			"dota1Image": "templar_assasin.gif"
		},
		{
			"name": "Terrorblade",
			"id": "terrorblade",
			"stat": "agility",
			"imageId": "terrorblade",
			"dota1Image": "terrorblade.gif"
		},
		{
			"name": "Tidehunter",
			"id": "tidehunter",
			"stat": "strength",
			"imageId": "tidehunter",
			"dota1Image": "tidehunter.gif"
		},
		{
			"name": "Timbersaw",
			"id": "timbersaw",
			"stat": "strength",
			"imageId": "shredder",
			"dota1Image": "timbersaw.jpg"
		},
		{
			"name": "Tinker",
			"id": "tinker",
			"stat": "intelligence",
			"imageId": "tinker",
			"dota1Image": "tinker.gif"
		},
		{
			"name": "Tiny",
			"id": "tiny",
			"stat": "strength",
			"imageId": "tiny",
			"dota1Image": "tiny.gif"
		},
		{
			"name": "Treant Protector",
			"id": "treant-protector",
			"stat": "strength",
			"imageId": "treant",
			"dota1Image": "treant_protector.gif"
		},
		{
			"name": "Troll Warlord",
			"id": "troll-warlord",
			"stat": "agility",
			"imageId": "troll_warlord",
			"dota1Image": "troll_warlord.gif"
		},
		{
			"name": "Tusk",
			"id": "tusk",
			"stat": "strength",
			"imageId": "tusk",
			"dota1Image": "tusk.jpg"
		},
		{
			"name": "Undying",
			"id": "undying",
			"stat": "strength",
			"imageId": "undying",
			"dota1Image": "undying.gif"
		},
		{
			"name": "Ursa",
			"id": "ursa",
			"stat": "agility",
			"imageId": "ursa",
			"dota1Image": "ursa.gif"
		},
		{
			"name": "Vengeful Spirit",
			"id": "vengeful-spirit",
			"stat": "agility",
			"imageId": "vengefulspirit",
			"dota1Image": "vengeful_spirit.jpg"
		},
		{
			"name": "Venomancer",
			"id": "venomancer",
			"stat": "agility",
			"imageId": "venomancer",
			"dota1Image": "venomancer.gif"
		},
		{
			"name": "Viper",
			"id": "viper",
			"stat": "agility",
			"imageId": "viper",
			"dota1Image": "viper.gif"
		},
		{
			"name": "Visage",
			"id": "visage",
			"stat": "intelligence",
			"imageId": "visage",
			"dota1Image": "visage.gif"
		},
		{
			"name": "Warlock",
			"id": "warlock",
			"stat": "intelligence",
			"imageId": "warlock",
			"dota1Image": "warlock.gif"
		},
		{
			"name": "Weaver",
			"id": "weaver",
			"stat": "agility",
			"imageId": "weaver",
			"dota1Image": "weaver.gif"
		},
		{
			"name": "Windranger",
			"id": "windranger",
			"stat": "intelligence",
			"imageId": "windrunner",
			"dota1Image": "wind_runner.gif"
		},
		{
			"name": "Winter Wyvern",
			"id": "winter-wyvern",
			"stat": "intelligence",
			"imageId": "winter_wyvern",
			"dota1Image": "winter_wyvern.gif"
		},
		{
			"name": "Witch Doctor",
			"id": "witch-doctor",
			"stat": "intelligence",
			"imageId": "witch_doctor",
			"dota1Image": "witch_doctor.gif"
		},
		{
			"name": "Wraith King",
			"id": "wraith-king",
			"stat": "strength",
			"imageId": "skeleton_king",
			"dota1Image": "wraith_king.gif"
		},
		{
			"name": "Zeus",
			"id": "zeus",
			"stat": "intelligence",
			"imageId": "zuus",
			"dota1Image": "zeus.jpg"
		}
	];

	function HeroBaseService(){}

	HeroBaseService.prototype.getHeroBases = function(){
		return heroBases;
	};

	return new HeroBaseService();
});