angular.module("WalrusPunch").service("translatorInformationService", [function(){

	var translators = [];

	function TranslatorInformationService(){
		for(var x = 0; x < 10; x+=1){
			translators.push(getRandomTranslator());
		}
	}

	TranslatorInformationService.prototype.getTranslators = function(){
		return translators;
	};

	function getRandomTranslator(){
		var translator = {
			name: getRandomName(),
			picture: getRandomPicture(),
			description: getRandomDescription(),
			languages: getRandomLanguages()
		};

		translator = addRandomContactInformation(translator);
		return translator;
	}

	function getRandomName(){
		var number = Math.round(Math.random() *5);
		switch(number){
			case 0: return "Corbin Young";
			case 1: return "李小龍";
			case 2: return "宮﨑 駿";
			case 3: return "Иван III Васильевич";
			case 4: return "Ἀλέξανδρος ὁ Μέγας";
			default: return "Ἀλέξανδρος ὁ Μέγας";
		}
	}

	function getRandomPicture(){
		var height = Math.round(Math.random() * 200 + 200);
		var width = Math.round(Math.random() * 200 + 200);
		return "http://fillmurray.com/"+width+"/"+height;
	}

	function getRandomDescription(){
		var number = Math.round(Math.random() *5);
		switch(number){
			case 0: return "By Day, admin assistant to the University of Texas. By night, punk rock mega-star.";
			case 1: return "Plays dota way too much and should probably stop";
			case 2: return "Never says die. I want to eat a million tacos.";
			case 3: return "Now this may seem like ordinary glove on plastic bottle, but I show you. It's much more. Because when you give squeeze it shows big middle finger that say FAK YOOOO";
			case 4: return "When is a camel not an armenian camel? Only when the eye of the tomato is truly superstitious can one eat a watermelon.";
			default: return "When is a camel not an armenian camel? Only when the eye of the tomato is truly superstitious can one eat a watermelon.";
		}
	}

	function addRandomContactInformation(translator){
		var hasTwitter = Math.round(Math.random());
		var hasWebsite = Math.round(Math.random());
		var hasGithub = Math.round(Math.random());
		var hasSteam = Math.round(Math.random());

		if(hasTwitter === 1){
			translator.twitterLink = "https://twitter.com/bxyoung89";
		}

		if(hasWebsite === 1){
			translator.websiteLink = "https://twitter.com/bxyoung89";
		}

		if(hasGithub === 1){
			translator.githubLink = "https://twitter.com/bxyoung89";
		}

		if(hasSteam === 1){
			translator.steamLink = "https://twitter.com/bxyoung89";
		}

		return translator;
	}

	function getRandomLanguages(){
		var number = Math.round(Math.random() *5);
		switch(number){
			case 0: return ["French"];
			case 1: return ["German", "Spanish"];
			case 2: return ["Traditional Chinese", "Simplified Chinese"];
			case 3: return ["Russian"];
			case 4: return ["Japanese", "Korean", "Portuguese"];
			default: return ["Japanese", "Korean", "Portuguese"];
		}
	}

	return new TranslatorInformationService();
}]);