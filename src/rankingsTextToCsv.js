import { readFile, writeFile } from 'fs/promises'

async function go() {
	const text = await readFile('data/input.txt', { encoding: 'utf8' })
	let result = text.replace(/\n/g, ' ').replace(/page \d+ of \d+/gi, '')

	result = Array.from(
		result.matchAll(
			/(\d+) (.+?) (\w+) (\w+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+) (\d+)/gi
		),
		(match) => {
			const data = match.slice(1)
			return data.join(',')
		}
	)
		.join('\n')
		.replace(
			/Rank Player Team Pos Points G A SOG PPG PPA SHG Hit BS PIM W SO GA SV/g,
			''
		)

	result = `Rank,Player,Team,Pos,Points,G,A,SOG,PPG,PPA,SHG,Hit,BS,PIM,W,SO,GA,SV\n${result}`

	await writeFile('data/rankings.csv', result)
}

go()
