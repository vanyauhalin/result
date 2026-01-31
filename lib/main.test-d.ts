import * as expectType from "expect-type"
import type {Result} from "./main.ts"
import {ok} from "./main.ts"

function fn(): Result<string> {
	return ok("some")
}

let r = fn()
if (r.err) {
	expectType.expectTypeOf(r.v).toEqualTypeOf<string | undefined>()
	expectType.expectTypeOf(r.err).toEqualTypeOf<Error>()
} else {
	expectType.expectTypeOf(r.v).toEqualTypeOf<string>()
	expectType.expectTypeOf(r.err).toEqualTypeOf<undefined>()
}
