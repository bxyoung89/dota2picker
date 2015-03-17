angular.module("WalrusPunch").service("translationService", [
	"$http",
	"$rootScope",
	"TRANSLATION_EVENTS",
	function ($http, $rootScope, TRANSLATION_EVENTS) {

		var state = "loading";
		var serverLocale = "en";
		var currentTranslationId = "english";
		var currentTranslation = {};
		var translationOptions = [];
		var nativeLanguages = {
			"English": "English",
			"French": "Français",
			"German": "Deutsch",
			"Japanese": "日本語",
			"Korean": "한국어",
			"Portuguese": "Português",
			"Russian": "Русский",
			"Simplified Chinese": "简体中文",
			"Spanish": "Español",
			"Traditional Chinese": "繁體中文"
		};
		var languageIds = {
			"English": "english",
			"French": "french",
			"German": "german",
			"Japanese": "japanese",
			"Korean": "korean",
			"Portuguese": "portuguese",
			"Russian": "russian",
			"Simplified Chinese": "simplifiedChinese",
			"Spanish": "spanish",
			"Traditional Chinese": "traditionalChinese"
		};

		var untranslatedStrings = {};

		function TranslationService() {
			getTranslation("english");
		}

		TranslationService.prototype.getState = function () {
			return state;
		};

		TranslationService.prototype.translateString = function (stringToTranslate) {
			var translatedString = currentTranslation[stringToTranslate];
			if (translatedString === undefined) {
				addToUntranslatedStrings(stringToTranslate);
				return stringToTranslate;
			}
			return translatedString;
		};

		TranslationService.prototype.translateHeroName = function (heroName) {
			var translatedString = currentTranslation.heroes[heroName];
			if (translatedString === undefined) {
				return heroName;
			}
			return translatedString;
		};

		TranslationService.prototype.translateLanguage = function (stringToTranslate) {
			if(currentTranslation.languages === undefined){
				return "";
			}
			var translatedString = currentTranslation.languages[stringToTranslate];
			if (translatedString === undefined) {
				return stringToTranslate;
			}
			return translatedString;
		};

		TranslationService.prototype.getHeroNicknames = function (heroName) {
			var nicknames = currentTranslation.heroNicknames[heroName];
			return nicknames;
		};

		TranslationService.prototype.changeTranslation = function (languageId) {
			state = "loading";
			getTranslation(languageId);
		};

		TranslationService.prototype.getTranslationOptions = function(){
			return translationOptions;
		};

		TranslationService.prototype.getCurrentTranslationId = function(){
			return currentTranslationId;
		};

		function getCurrentLocale() {
			//todo
		}

		function getTranslation(languageId) {
			$http.get("/getTranslation?language=" + languageId)
				.success(function (data) {
					if (typeof data === "string") {
						data = JSON.parse(data);
					}
					currentTranslation = data;
					currentTranslationId = languageId;
					updateTranslationOptions();
					state = "done";
					$rootScope.$broadcast(TRANSLATION_EVENTS.translationChanged);
				})
				.error(function (data) {
					state = "error";
				});
		}

		function localeToLanguage(locale) {
			switch (locale.toLowerCase()) {
				case "en":
					return "english";
				case "es":
					return "spanish";
				default:
					return "english";
			}
		}

		function updateTranslationOptions() {
			translationOptions = Object.keys(nativeLanguages).map(function (englishLanguageLang) {
				var translatedLanguage = currentTranslation.languages[englishLanguageLang];
				return {
					name: translatedLanguage + " (" + nativeLanguages[englishLanguageLang] + ")",
					id: languageIds[englishLanguageLang]
				};
			});
		}

		function addToUntranslatedStrings(string){
			if(untranslatedStrings[currentTranslationId] === undefined){
				untranslatedStrings[currentTranslationId] = {};
			}
			untranslatedStrings[currentTranslationId][string] = string;
			console.log(untranslatedStrings);

		}


		return new TranslationService();
	}]);