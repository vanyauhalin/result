import * as esbuild from "esbuild"
import pack from "../package.json" with {type: "json"}
import * as tsconfig from "./tsconfig.ts"

async function main(): Promise<void> {
	let c = await tsconfig.load(process)
	let o: esbuild.BuildOptions = {
		bundle: true,
		entryPoints: [...c.files],
		format: "esm",
		logLevel: "error",
		outfile: pack.main,
		platform: "neutral",
		target: c.compilerOptions.target,
		tsconfigRaw: c,
	}
	await esbuild.build(o)
}

void main()
