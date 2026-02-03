import config from "@vanyauhalin/eslint-config"

export default [
	...config,
	{
		files: ["./lib/main.ts"],
		rules: {
			"jsdoc/require-throws-type": "off", // https://github.com/microsoft/rushstack/issues/5270/
			"typescript/no-invalid-void-type": "off",
			"typescript/no-unused-vars": "off",
		},
	},
	{
		files: ["./README.md/*.ts"],
		rules: {
			"typescript/no-unused-vars": "off",
			"unicorn/no-console-spaces": "off",
		},
	},
]
