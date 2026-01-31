import assert from "node:assert/strict"
import * as result from "./main.ts"
import test from "./test.ts"

void test("ok", (t) => {
	void t.test("creates with a non-void value", () => {
		let r = result.ok("some")
		assert.deepEqual(Object.keys(r), ["v", "err"])
		assert.deepEqual(r, {v: "some", err: undefined})
	})

	void t.test("creates with a void value", () => {
		let r = result.ok()
		assert.deepEqual(Object.keys(r), ["v", "err"])
		assert.deepEqual(r, {v: undefined, err: undefined})
	})
})

void test("err", (t) => {
	void t.test("creates with an Error", () => {
		let e = new Error("some")
		let r = result.err(e)
		assert.deepEqual(Object.keys(r), ["v", "err"])
		assert.deepEqual(r, {v: undefined, err: e})
	})

	void t.test("creates with a subclass of Error", () => {
		class SomeError extends Error {
			constructor() {
				super()
				this.name = "SomeError"
			}
		}

		let e = new SomeError()
		let r = result.err(e)
		assert.deepEqual(Object.keys(r), ["v", "err"])
		assert.deepEqual(r, {v: undefined, err: e})
	})

	void t.test("creates with a value and an Error", () => {
		let e = new Error("some")
		let r = result.err("some", e)
		assert.deepEqual(Object.keys(r), ["v", "err"])
		assert.deepEqual(r, {v: "some", err: e})
	})
})

void test("must", (t) => {
	void t.test("returns the value when the result is Ok", () => {
		let r = result.ok("some")
		let v = result.must(r)
		assert.deepEqual(v, "some")
	})

	void t.test("throws the error when the result is Err", () => {
		let e = new Error("some")
		let r = result.err(e)
		try {
			result.must(r)
			assert.fail("must() did not throw")
		} catch(err) {
			assert.deepEqual(err, e)
		}
	})
})

void test("safeNew", (t) => {
	void t.test("returns an Ok result when the constructor succeeds", () => {
		class Some {}

		let r = result.safeNew(Some)
		assert.deepEqual(r.err, undefined)

		assert.deepEqual(r.v instanceof Some, true)
	})

	void t.test("returns an Error result when the constructor throws", () => {
		class Some {
			constructor() {
				throw new Error("some")
			}
		}

		let r = result.safeNew(Some)

		if (r.err instanceof Error) {
			assert.deepEqual(r.err.message, "some")
		} else {
			assert.fail("err is not an Error")
		}

		assert.deepEqual(r.v, undefined)
	})

	void t.test("returns a NonError result when the constructor throws non-Error value", () => {
		class Some {
			constructor() {
				// eslint-disable-next-line typescript/only-throw-error
				throw "some"
			}
		}

		let r = result.safeNew(Some)

		if (r.err instanceof result.NonError) {
			assert.deepEqual(r.err.name, "NonError")
			assert.deepEqual(r.err.message, "Non-Error thrown")
			assert.deepEqual(r.err.cause, "some")
		} else {
			assert.fail("err is not a NonError")
		}

		assert.deepEqual(r.v, undefined)
	})
})

void test("safeSync", (t) => {
	void t.test("returns an Ok result when the function succeeds", () => {
		function fn(): string {
			return "some"
		}

		let r = result.safeSync(fn)
		assert.deepEqual(r.err, undefined)

		assert.deepEqual(r.v, "some")
	})

	void t.test("returns an Error result when the function throws", () => {
		function fn(): void {
			throw new Error("some")
		}

		let r = result.safeSync(fn)

		if (r.err instanceof Error) {
			assert.deepEqual(r.err.message, "some")
		} else {
			assert.fail("err is not an Error")
		}

		assert.deepEqual(r.v, undefined)
	})

	void t.test("returns a NonError result when the function throws non-Error value", () => {
		function fn(): void {
			// eslint-disable-next-line typescript/only-throw-error
			throw "some"
		}

		let r = result.safeSync(fn)

		if (r.err instanceof result.NonError) {
			assert.deepEqual(r.err.name, "NonError")
			assert.deepEqual(r.err.message, "Non-Error thrown")
			assert.deepEqual(r.err.cause, "some")
		} else {
			assert.fail("err is not a NonError")
		}

		assert.deepEqual(r.v, undefined)
	})
})

void test("safeAsync", (t) => {
	void t.test("returns an Ok result when the function succeeds", async() => {
		// eslint-disable-next-line typescript/require-await
		async function fn(): Promise<string> {
			return "some"
		}

		let r = await result.safeAsync(fn)
		assert.deepEqual(r.err, undefined)

		assert.deepEqual(r.v, "some")
	})

	void t.test("returns an Error result when the function throws", async() => {
		// eslint-disable-next-line typescript/require-await
		async function fn(): Promise<void> {
			throw new Error("some")
		}

		let r = await result.safeAsync(fn)

		if (r.err instanceof Error) {
			assert.deepEqual(r.err.message, "some")
		} else {
			assert.fail("err is not an Error")
		}

		assert.deepEqual(r.v, undefined)
	})

	void t.test("returns a NonError result when the function throws non-Error value", async() => {
		// eslint-disable-next-line typescript/require-await
		async function fn(): Promise<void> {
			// eslint-disable-next-line typescript/only-throw-error
			throw "some"
		}

		let r = await result.safeAsync(fn)

		if (r.err instanceof result.NonError) {
			assert.deepEqual(r.err.name, "NonError")
			assert.deepEqual(r.err.message, "Non-Error thrown")
			assert.deepEqual(r.err.cause, "some")
		} else {
			assert.fail("err is not a NonError")
		}

		assert.deepEqual(r.v, undefined)
	})
})
