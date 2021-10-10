import dotenv from 'dotenv'
import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import parse from 'csv-parse/lib/sync.js'
import { readFile } from 'fs/promises'
import pLimit from 'p-limit'
import _ from 'lodash'

dotenv.config()

import { getAccessToken, refreshTheToken } from './auth.js'

const minListSize = 20

function playerFactory(playerData, rankingData) {
	return {
		name: playerData.name.full,
		position: playerData.display_position,
		team: playerData.editorial_team_abbr.toUpperCase(),
		projectedRank: _.toNumber(rankingData.Rank),
		projectedPoints: _.toNumber(rankingData.Points),
	}
}

async function theQuery(playerKeys) {
	const { access_token } = await getAccessToken()
	const playerKeyString = playerKeys.join(',')
	try {
		const { data } = await axios.get(
			`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;is_available=1/leagues/players;player_keys=${playerKeyString};out=ownership`,
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
			return theQuery(playerKeys)
		}
		throw err
	}
}

async function getBestAvailablePlayers() {
	const results = []
	const rankingsCsv = await readFile('data/rankings.csv', 'utf8')
	const rankings = parse(rankingsCsv, { columns: true, bom: true })
	const playerData = JSON.parse(await readFile('data/players.json', 'utf8'))
	const limit = pLimit(1)

	const chunkSize = 20

	const promise = new Promise((resolve) => {
		_.chunk(rankings, chunkSize).map((rankingChunk, rankingIndex) =>
			limit(async () => {
				try {
					const playerKeys = rankingChunk
						.map(
							(r) =>
								playerData.find(
									(pd) =>
										pd.name === r.Player &&
										pd.team.toLowerCase() ===
											r.Team.toLowerCase()
								)?.key
						)
						.filter(Boolean)
					const response = await theQuery(playerKeys)
					let players =
						response?.fantasy_content?.users?.user?.games?.game
							?.leagues?.league[0]?.players?.player

					players = players
						.filter((p) => !p.ownership.owner_team_key)
						.map((p) => {
							const rankingData = rankingChunk.find(
								(r) =>
									p.name.full === r.Player &&
									p.editorial_team_abbr.toLowerCase() ===
										r.Team.toLowerCase()
							)
							return playerFactory(p, rankingData)
						})

					results.push(...players)

					if (results.length >= minListSize) {
						console.log(
							`${
								results.length
							} players found from searching through ${
								rankingIndex * chunkSize
							}.`
						)
						limit.clearQueue()
						resolve()
					}
				} catch (err) {
					console.error(err)
					if (err.response.status === 999) {
						limit.clearQueue()
						console.error(
							'We got rate limited! Killing the process.'
						)
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
		console.log(`Fetching the ${minListSize} best available players...`)
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
