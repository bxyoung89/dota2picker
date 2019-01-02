module.exports = {
	"extends": "airbnb-base",
	"rules": {
		"indent": ["error", "tab"],
		"no-tabs": "off",
		"linebreak-style": ["warn", "windows"],
		"quotes": ["error", "double"],
		"max-len": "off",
		"class-methods-use-this": "off",
		"no-param-reassign": "off",
		"no-restricted-syntax": "off",
		"no-await-in-loop": "off",
		"no-console": "off",
	},
	"env": {
		"browser": true,
		"node": true,
	},
	"globals": {
		"angular": true,
		"$": true,
	}
};