![][cover]

# result

Safe error handling without exceptions for JavaScript, inspired by
[Go's error model].

## Contents

- [Why?](#why)
- [Installation](#installation)
  - [npm](#npm)
  - [GitHub Packages](#github-packages)
  - [JSR (JavaScript Registry)](#jsr-javascript-registry)
  - [GitHub Releases](#github-releases)
- [Usage](#usage)
- [API](#api)
  - [`Result`](#result-1  )
  - [`Ok`](#ok)
  - [`Err`](#err)
  - [`ok(value)`](#okvalue)
  - [`err(error)`](#errerror)
  - [`must(result)`](#mustresult)
  - [`safeNew(constructor, ...args)`](#safenewconstructor-args)
  - [`safeSync(fn, ...args)`](#safesyncfn-args)
  - [`safeAsync(fn, ...args)`](#safeasyncfn-args)
  - [`NonError`](#nonerror)
  - [`NonErrorOptions`](#nonerroroptions)
- [ESLint plugin](#eslint-plugin)
- [Compatibility](#compatibility)
- [License](#license)

## Why?

I began my career as a JavaScript developer, but eventually started exploring
beyond the JavaScript ecosystem. Go was one of those discoveries that changed
how I approach programming — especially [error handling][Go's error model].

Go's error handling is polarizing. You either love it or hate it; there is
rarely middle ground. I found myself in the first camp. The explicit nature of
error handling, where errors are values that must be consciously dealt with,
felt refreshingly honest compared to the unpredictable world of exceptions.

This package is my attempt to bring that same clarity and explicitness to
JavaScript. Instead of hoping exceptions do not slip through the cracks, you
handle errors as intentionally as you handle success cases.

It is purposefully small — perhaps ridiculously so for something published to a
registry. For a while, I copied the implementation from project to project. But
after some time, I decided to publish it for easier reuse, and so I could write
an [ESLint plugin] to address specific patterns and potential issues.

If you find yourself interested in replacing try-catch with something else, but
this package lacks features you need, take a look at [NeverThrow]. Unlike this
implementation, NeverThrow is inspired by [Rust's error model] and offers way
more features.

## Installation

### npm

```sh
npm install @vanyauhalin/result
```

### GitHub Packages

```sh
npm install --registry https://npm.pkg.github.com @vanyauhalin/result
```

### JSR (JavaScript Registry)

```sh
npx jsr add @vanyauhalin/result
```

### GitHub Releases

```sh
npm install vanyauhalin-result-x.x.x.tgz
```

## Usage

```ts
import * as result from "@vanyauhalin/result"

type User = {
	login: string
	id: number
	name: string
}

async function fetchUser(id: string): Promise<result.Result<User>> {
	const u = result.safeNew(URL, id, "https://api.github.com/users/")
	if (u.err) {
		return result.err(new Error(`Creating a URL for user ${id}`, {cause: u.err}))
	}

	const r = await result.safeAsync(fetch, u.v)
	if (r.err) {
		return result.err(new Error(`Fetching a user with id ${id}`, {cause: r.err}))
	}

	const o = await result.safeAsync(r.v.json.bind(r.v))
	if (o.err) {
		return result.err(new Error(`Getting JSON for user ${id}`, {cause: o.err}))
	}

	return result.ok(o.v as User)
}

async function main(): Promise<void> {
	const u = await fetchUser("ry")
	if (u.err) {
		console.error(u.err)
		return
	}

	console.log("Login:", u.v.login)
	console.log("Name: ", u.v.name)
	console.log("ID:   ", u.v.id)

	// Login: ry
	// Name:  Ryan Dahl
	// ID:    80
}

void main()
```

## API

This package exports core result types [`Result`](#result-1), [`Ok`](#ok),
[`Err`](#err), result utilities [`ok`](#okvalue), [`err`](#errerror),
[`must`](#mustresult), safe wrapper functions
[`safeNew`](#safenewconstructor-args), [`safeSync`](#safesyncfn-args),
[`safeAsync`](#safeasyncfn-args), and exception wrapping
[`NonError`](#nonerror), [`NonErrorOptions`](#nonerroroptions) from the main
module. There is no default export.

### `Result`

Result type representing either a success or an error (TypeScript type).

This is a discriminated union of [`Ok<V, E>`](#ok) and [`Err<V, E>`](#err).

###### Type parameters

* `V` (default: `unknown`)
  — type of the success value
* `E` (default: `Error`)
  — type of the error, must extend `Error`

### `Ok`

Success variant of [`Result`](#result-1) containing a value (TypeScript type).

###### Type parameters

* `V`
  — type of the success value
* `E`
  — type of the error, must extend `Error`

###### Fields

* `v` (`V`)
  — the success value
* `err` (`undefined`)
  — always undefined for success results

### `Err`

Error variant of [`Result`](#result-1) containing an error (TypeScript type).

###### Type parameters

* `V`
  — type of the success value
* `E`
  — type of the error, must extend `Error`

###### Fields

* `v` (`undefined`)
  — always undefined for error results
* `err` (`E`)
  — the error

### `ok(value)`

Creates a success [`Result`](#result-1) containing the given value.

###### Parameters

* `value` (`V`)
  — value to wrap in a success result

###### Returns

Success result containing the value ([`Ok<V, E>`](#ok)).

### `err(error)`

Creates an error [`Result`](#result-1) containing the given error.

###### Parameters

* `error` (`E extends Error`)
  — error to wrap in an error result

###### Returns

Error result containing the error ([`Err<V, E>`](#err)).

### `must(result)`

Unwraps a [`Result`](#result-1), throwing the error if it exists.

###### Parameters

* `result` ([`Result<V, E>`](#result-1))
  — the result to unwrap

###### Throws

The error contained in the result, if any.

###### Returns

The value contained in the result (`V`).

###### Example

```ts
const s = "https://example.com"
const r = safeNew(URL, s)
const v = must(r)
// v is a URL, or error is thrown
```

### `safeNew(constructor, ...args)`

Safely calls a constructor function, returning a [`Result`](#result-1).

If the thrown value is not an `Error`, it will be wrapped in a
[`NonError`](#nonerror).

###### Parameters

* `constructor` (`new (...args: A) => R`)
  — the constructor function to call
* `args` (`...A`)
  — the arguments to pass to the constructor function

###### Returns

A result containing the constructed object or an error
([`Result<R>`](#result-1)).

###### Example

```ts
const s = "https://example.com"
const r = safeNew(URL, s)
if (r.err) {
	// r.err is an Error
} else {
	// r.v is a URL
}
```

### `safeSync(fn, ...args)`

Safely calls a synchronous function, returning a [`Result`](#result-1).

If the thrown value is not an `Error`, it will be wrapped in a
[`NonError`](#nonerror).

###### Parameters

* `fn` (`(...args: A) => R`)
  — the synchronous function to call
* `args` (`...A`)
  — the arguments to pass to the function

###### Returns

A result containing the return value or an error ([`Result<R>`](#result-1)).

###### Example

```ts
const s = "{}"
const r = safeSync(JSON.parse, s)
if (r.err) {
	// r.err is an Error
} else {
	// r.v is any
}
```

### `safeAsync(fn, ...args)`

Safely calls an asynchronous function, returning a [`Result`](#result-1).

If the thrown value is not an `Error`, it will be wrapped in a
[`NonError`](#nonerror).

###### Parameters

* `fn` (`(...args: A) => PromiseLike<R>`)
  — the asynchronous function to call
* `args` (`...A`)
  — the arguments to pass to the function

###### Returns

Promise that resolves to a result containing the awaited value or an error
([`Promise<Result<Awaited<R>>>`](#result-1)).

###### Example

```ts
const f = "/tmp/app.log"
const r = await result.safeAsync(fs.readFile, f, "utf8")
if (r.err) {
	// r.err is an Error
} else {
	// r.v is a string
}
```

### `NonError`

Error class representing a non-Error being thrown.

###### Fields

* `name` (`"NonError"`)
  — the error name
* `cause` (`unknown`)
  — the original thrown value that was not an Error

###### Constructor

* `options` ([`NonErrorOptions`](#nonerroroptions))
  — configuration for the NonError

### `NonErrorOptions`

Options for [`NonError`](#nonerror) (TypeScript type).

Extends the standard `ErrorOptions` with an explicit `cause` field.

###### Fields

* `cause` (`unknown`)
  — the original thrown value that was not an Error

## ESLint plugin

See [`@vanyauhalin/eslint-plugin-result`][ESLint plugin] for accompanying ESLint
plugin.

## Compatibility

This package is ESM only. The minimum supported Node.js version is 16.

## License

Code: [MIT] © [Ivan Uhalin]\
Illustrations: [CC BY-NC-SA 4.0] © [Ivan Uhalin]

<!-- Definitions -->

[Go's error model]: https://go.dev/blog/error-handling-and-go
[Rust's error model]: https://doc.rust-lang.org/book/ch09-00-error-handling.html

[ESLint plugin]: https://github.com/vanyauhalin/eslint-plugin-result/
[NeverThrow]: https://github.com/supermacro/neverthrow/

[cover]: https://raw.githubusercontent.com/vanyauhalin/result/refs/heads/main/cover.png
[MIT]: https://github.com/vanyauhalin/result/blob/main/LICENSE-MIT
[CC BY-NC-SA 4.0]: https://github.com/vanyauhalin/result/blob/main/LICENSE-CC-BY-NC-SA-4.0
[Ivan Uhalin]: https://github.com/vanyauhalin/
