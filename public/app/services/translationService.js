angular.module("WalrusPunch").service("translationService", ["$http", function($http){

	var state = "loading";
	var serverLocale = "en";
	var currentTranslationName = "English";
	var currentTranslation = {};
	var translationOptions = [];
	var nativeLanguages = {
		"English": "English",
		"Spanish": "Español"
	};

	function TranslationService(){
		getTranslation();
	}

	TranslationService.prototype.getTranslatedString = function(stringToTranslate){
		var translatedString = currentTranslation[stringToTranslate];
		if(translatedString === undefined){
			return "Shitty Wizard";
		}
		return translatedString;
	};

	TranslationService.prototype.getTranslatedHeroName = function(heroName){
		var translatedString = currentTranslation.heroes[heroName];
		if(translatedString === undefined){
			return "Shitty Wizard";
		}
		return translatedString;
	};

	TranslationService.prototype.getHeroNicknames = function(heroName){
		var nicknames = currentTranslation.heroNickNames[heroName];
		return nicknames;
	};

	TranslationService.prototype.getTranslatedRole = function(role){
		var translatedString = currentTranslation.roles[role];
		if(translatedString === undefined){
			return "Shitty Wizard";
		}
		return translatedString;
	};

	function getCurrentLocale(){
		//todo
	}

	function getTranslation(){
		$http.get("/getTranslation?language=english")
			.success(function(data){
				if(typeof data === "string"){
					data = JSON.parse(data);
				}
				currentTranslation = data;
				updateTranslationOptions();
			})
			.error(function(data){
				state = error;
			});
	}

	function localeToLanguage(locale){
		switch(locale.toLowerCase()){
			case "en": return "english";
			case "es": return "spanish";
			default: return "english";
		}
	}

	function updateTranslationOptions(){
		translationOptions = Object.keys(nativeLanguages).map(function(englishLanguageLang){
			var translatedLanguage = currentTranslation.languages[englishLanguageLang];
			return translatedLanguage+" ("+nativeLanguages[englishLanguageLang]+")";
		});
	}



	return new TraslationService();
}]);