import dotenv from 'dotenv'
import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import parse from 'csv-parse/lib/sync.js'
import { readFile } from 'fs/promises'
import pLimit from 'p-limit'

dotenv.config()

import { getAccessToken, refreshTheToken } from './auth.js'

function playerFactory(playerData) {
	return {
		name: playerData.name.full,
		position: playerData.display_position,
		team: playerData.editorial_team_abbr,
	}
}

async function theQuery(search = 'petterson') {
	const { access_token } = await getAccessToken()
	search = encodeURIComponent(search)
	try {
		const { data } = await axios.get(
			`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;is_available=1/leagues/players;search=${search};status=A/stats`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		)

		const result = await parseStringPromise(data, {
			explicitArray: false,
			emptyTag: null,
		})

		return result
	} catch (err) {
		if (err.response.status === 401) {
			await refreshTheToken()
			return theQuery(search)
		}
		throw err
	}
}

async function getBestAvailablePlayers() {
	const results = []
	const rankingsCsv = await readFile('data/rankings.csv', 'utf8')
	const rankings = parse(rankingsCsv, { columns: true })
	const limit = pLimit(1)

	const promise = new Promise((resolve) => {
		rankings.map((ranking, rankingIndex) =>
			limit(async () => {
				try {
					const response = await theQuery(ranking.Player)
					const player =
						response?.fantasy_content?.users?.user?.games?.game?.leagues?.league
							?.players?.player

					if (
						player &&
						ranking.Team.toLowerCase() ===
							player.editorial_team_abbr.toLowerCase()
					) {
						results.push(playerFactory(player))
					}

					if (rankingIndex !== 0 && rankingIndex % 10 === 0) {
						console.log(
							`Found ${results.length} players. Searched ${rankingIndex} so far`
						)
					}

					if (results.length >= 10) {
						console.log(
							`${results.length} players found from searching through ${rankingIndex}. Clearing queue.`
						)
						limit.clearQueue()
						resolve()
					}
				} catch (err) {
					console.error(err)
					if (err.response.status === 999) {
						limit.clearQueue()
						console.error('We got rate limited! Killing the process.')
						process.exit(1)
					}
				}
			})
		)
	})

	await promise

	return results
}

async function main() {
	try {
		console.log('Fetching the 10 best available players...')
		const results = await getBestAvailablePlayers()

		console.table(results)
	} catch (err) {
		let error
		try {
			error = await parseStringPromise(err.response.data)
		} catch (_) {
			error = err
		}
		console.error(error)
	}
}

main()
