const isError: (v: unknown) => v is Error = (() => {
	if ("isError" in Error) {
		// @ts-ignore
		return Error.isError.bind(Error)
	}
	return (v) => v instanceof Error
})()

/**
 * Options for {@link NonError}.
 */
export type NonErrorOptions = ErrorOptions & {
	cause: unknown
}

/**
 * Error class representing a non-Error being thrown.
 */
export class NonError extends Error {
	name: "NonError"
	cause: unknown

	constructor(o: NonErrorOptions) {
		super("Non-Error thrown", o)
		this.name = "NonError"
		this.cause = o.cause
	}
}

/**
 * Result type representing either a success or an error.
 */
export type Result<V = unknown, E extends Error = Error> = Ok<V, E> | Err<V, E>

/**
 * Success variant of {@link Result} containing a value.
 */
export type Ok<V, E extends Error> = {v: V; err: undefined}

/**
 * Error variant of {@link Result} containing an error.
 */
export type Err<V, E extends Error> = {v: undefined; err: E}

/**
 * Creates a success {@link Result} containing the given value.
 */
export function ok<V, E extends Error = never>(v: V): Ok<V, E>
export function ok<V extends void = void, E extends Error = never>(v: void): Ok<V, E>
export function ok<V, E extends Error = never>(v: V): Ok<V, E> {
	return {v, err: undefined}
}

/**
 * Creates an error {@link Result} containing the given error.
 */
export function err<V = never, E extends Error = never>(err: E): Err<V, E> {
	return {v: undefined, err}
}

/**
 * Unwraps a {@link Result}, throwing the error if it exists.
 *
 * @example
 * ```
 * const s = "https://example.com"
 * const r = safeNew(URL, s)
 * const v = must(r)
 * // v is a URL, or error is thrown
 * ```
 *
 * @param r The {@link Result} to unwrap.
 * @returns The value contained in the {@link Result}.
 * @throws The error contained in the {@link Result}, if any.
 */
export function must<V, E extends Error>(r: Result<V, E>): V {
	if (r.err) {
		throw r.err
	}
	return r.v as V
}

/**
 * Safely calls a constructor function, returning a {@link Result}.
 *
 * @remarks
 * If the thrown value is not an `Error`, it will be wrapped in a
 * {@link NonError}.
 *
 * @example
 * ```
 * const s = "https://example.com"
 * const r = safeNew(URL, s)
 * if (r.err) {
 * 	// r.err is an Error
 * } else {
 * 	// r.v is a URL
 * }
 * ```
 *
 * @param fn The constructor function to call.
 * @param args The arguments to pass to the constructor function.
 * @returns A {@link Result} containing the constructed object or an error.
 */
export function safeNew<
	A extends unknown[],
	R,
>(
	fn: new (...args: A) => R,
	...args: A
): Result<R> {
	try {
		return ok(new fn(...args))
	} catch(err_) {
		if (isError(err_)) {
			return err(err_)
		}
		return err(new NonError({cause: err_}))
	}
}

/**
 * Safely calls a synchronous function, returning a {@link Result}.
 *
 * @remarks
 * If the thrown value is not an `Error`, it will be wrapped in a
 * {@link NonError}.
 *
 * @example
 * ```
 * const s = "{}"
 * const r = safeSync(JSON.parse, s)
 * if (r.err) {
 * 	// r.err is an Error
 * } else {
 * 	// r.v is any
 * }
 * ```
 *
 * @param fn The synchronous function to call.
 * @param args The arguments to pass to the function.
 * @returns A {@link Result} containing the return value or an error.
 */
export function safeSync<
	A extends unknown[],
	R,
>(
	fn: (...args: A) => R,
	...args: A
): Result<R> {
	try {
		return ok(fn(...args))
	} catch(err_) {
		if (isError(err_)) {
			return err(err_)
		}
		return err(new NonError({cause: err_}))
	}
}

/**
 * Safely calls an asynchronous function, returning a {@link Result}.
 *
 * @remarks
 * If the thrown value is not an `Error`, it will be wrapped in a
 * {@link NonError}.
 *
 * @example
 * ```
 * const f = "/tmp/app.log"
 * const r = await result.safeAsync(fs.readFile, f, "utf8")
 * if (r.err) {
 * 	// r.err is an Error
 * } else {
 * 	// r.v is a string
 * }
 * ```
 *
 * @param fn The asynchronous function to call.
 * @param args The arguments to pass to the function.
 * @returns A {@link Result} containing the awaited value or an error.
 */
export async function safeAsync<
	A extends unknown[],
	R,
>(
	fn: (...args: A) => PromiseLike<R>,
	...args: A
): Promise<Result<Awaited<R>>> {
	try {
		return ok(await Promise.resolve(fn(...args)))
	} catch(err_) {
		if (isError(err_)) {
			return err(err_)
		}
		return err(new NonError({cause: err_}))
	}
}
