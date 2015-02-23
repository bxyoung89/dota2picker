angular.module("WalrusPunch").service("translationService", ["$http", function($http){

	var state = "loading";
	var serverLocale = "en";
	var currentTranslationName = "";
	var currentTranslation = {};
	var translationOptions = [];
	var nativeLanguages = {
		"English": "English",
		"Spanish": "Español",
		"Simplified Chinese": "简体中文"
	};
	var languageIds = {
		"English": "english",
		"Spanish": "spanish",
		"Simplified Chinese": "simplifiedChinese"
	};

	function TranslationService(){
		currentTranslationName = "English";
		getTranslation("english");
	}

	TranslationService.prototype.getState = function(){
		return state;
	};

	TranslationService.prototype.translateString = function(stringToTranslate){
		var translatedString = currentTranslation[stringToTranslate];
		if(translatedString === undefined){
			return "Shitty Wizard";
		}
		return translatedString;
	};

	TranslationService.prototype.translateHeroName = function(heroName){
		var translatedString = currentTranslation.heroes[heroName];
		if(translatedString === undefined){
			return "Shitty Wizard";
		}
		return translatedString;
	};

	TranslationService.prototype.getHeroNicknames = function(heroName){
		var nicknames = currentTranslation.heroNicknames[heroName];
		return nicknames;
	};

	TranslationService.prototype.translateRole = function(role){
		var translatedString = currentTranslation.roles[role];
		if(translatedString === undefined){
			return "Shitty Wizard";
		}
		return translatedString;
	};

	TranslationService.prototype.changeTranslation = function(languageId){
		state = "loading";
		getTranslation(languageId);
	};

	function getCurrentLocale(){
		//todo
	}

	function getTranslation(languageId){
		$http.get("/getTranslation?language="+languageId)
			.success(function(data){
				if(typeof data === "string"){
					data = JSON.parse(data);
				}
				currentTranslation = data;
				updateTranslationOptions();
				state = "done";
			})
			.error(function(data){
				state = "error";
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
			return {
				name:translatedLanguage+" ("+nativeLanguages[englishLanguageLang]+")",
				id: languageIds[englishLanguageLang]
			};
		});
	}



	return new TranslationService();
}]);