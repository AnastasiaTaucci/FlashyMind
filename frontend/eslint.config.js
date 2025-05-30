const {
	defineConfig,
} = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
	expoConfig,
	{
		...eslintPluginPrettierRecommended,
		rules: {
			...eslintPluginPrettierRecommended.rules,
			quotes: [
				"warn",
				"single",
				{ avoidEscape: true },
			],
			"prettier/prettier": [
				"warn",
				{
					singleQuote: true,
					semi: true,
					tabWidth: 2,
					trailingComma:
						"es5",
					printWidth: 100,
				},
			],
		},
	},
	{
		files: [
			"**/__tests__/**/*.js",
			"**/*.test.js",
		],
		languageOptions: {
			globals: {
				describe: "readonly",
				it: "readonly",
				test: "readonly",
				expect: "readonly",
				beforeEach: "readonly",
				afterEach: "readonly",
				beforeAll: "readonly",
				afterAll: "readonly",
				jest: "readonly",
			},
		},
		plugins: {
			jest: require("eslint-plugin-jest"),
		},
		rules: {
			...require("eslint-plugin-jest")
				.configs.recommended
				.rules,
		},
	},
	{
		ignores: ["dist/*"],
	},
]);
