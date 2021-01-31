import dotenv from 'dotenv'
import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import parse from 'csv-parse/lib/sync.js'
import { readFile } from 'fs/promises'
import _ from 'lodash'

dotenv.config()

import { getAccessToken, refreshTheToken } from './auth.js'

function playerFactory(playerData, rankingData) {
	return {
		name: playerData.name.full,
		position: playerData.display_position,
		team: playerData.editorial_team_abbr.toUpperCase(),
		projectedRank: _.toNumber(rankingData.Rank),
		projectedPoints: _.toNumber(rankingData.Points),
	}
}

async function theQuery() {
	const { access_token } = await getAccessToken()
	try {
		const { data } = await axios.get(
			`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;is_available=1/leagues/teams/players`,
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
			return theQuery()
		}
		throw err
	}
}

async function getBestAvailablePlayers() {
	const rankingsCsv = await readFile('data/rankings.csv', 'utf8')
	const rankings = parse(rankingsCsv, { columns: true })

	try {
		const response = await theQuery()
		let players =
			response?.fantasy_content?.users?.user?.games?.game?.leagues?.league
				?.teams?.team?.players?.player

		players = players.map((p) => {
			const rankingData = rankings.find(
				(r) =>
					p.name.full === r.Player &&
					p.editorial_team_abbr.toLowerCase() === r.Team.toLowerCase()
			)
			return playerFactory(p, rankingData)
		})

		players = _.orderBy(players, 'projectedRank')

		return players
	} catch (err) {
		console.error(err)
		if (err.response.status === 999) {
			console.error('We got rate limited! Killing the process.')
			process.exit(1)
		}
	}
}

async function main() {
	try {
		console.log(`Fetching your team...`)
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
