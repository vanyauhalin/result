import path from "node:path"
import * as tsconfig from "../data/tsconfig.json.ts"

async function main(): Promise<void> {
	let d = process.cwd()
	let c = await tsconfig.load(process)
	for (let f of c.files) {
		await import(`file://${path.join(d, f)}`)
	}
}

void main()
