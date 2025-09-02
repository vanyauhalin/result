export type TsconfigJson = {
	compilerOptions: {
		target: string
	}
	files: string[]
}

export async function load(p: NodeJS.Process): Promise<TsconfigJson> {
	let t = await read(p)
	return JSON.parse(t)
}

async function read(p: NodeJS.Process): Promise<string> {
	return await new Promise((res, rej) => {
		let s = ""

		p.stdin.on("data", (d) => {
			s += d.toString()
		})

		p.stdin.on("end", () => {
			res(s)
		})

		p.stdin.on("error", (e) => {
			rej(e)
		})
	})
}
