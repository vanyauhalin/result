import config from "@vanyauhalin/eslint-config"

export default [
	...config,
	{
		files: ["**/*.ts"],
		rules: {
			"no-restricted-syntax": "off",
			"unicorn/prefer-top-level-await": "off",
		},
	},
	{
		files: ["lib/main.ts"],
		rules: {
			"new-cap": "off",
			"jsdoc/check-tag-names": ["error", {definedTags: ["remarks"]}],
			"typescript/no-invalid-void-type": "off",
			"typescript/no-unused-vars": "off",
		},
	},
	{
		files: ["README.md/*.ts"],
		rules: {
			"prefer-let/prefer-let": "off",
			"typescript/no-unused-vars": "off",
			"unicorn/no-console-spaces": "off",
			"unicorn/prefer-top-level-await": "off",
		},
	},
]
