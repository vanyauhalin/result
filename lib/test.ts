// The built-in test runner was introduced in v18.0.0, then ported back to
// v16.17.0. This file provides backward compatibility for versions older than
// v16.17.0.

import module from "node:module"
import type Test from "node:test"

const require = module.createRequire(import.meta.url)

const test: typeof Test = (() => {
	try {
		return require("node:test")
	} catch {
		return (async(n, cb) => {
			try {
				await (cb as Test.TestFn)({test} as Test.TestContext, () => {})
				console.log("+", n)
			} catch(err) {
				console.error("-", n)
				throw err
			}
		}) as typeof Test
	}
})()

// Use default export as the built-in test runner uses default export.
// eslint-disable-next-line import-x/no-default-export
export default test
