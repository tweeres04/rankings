import dotenv from 'dotenv'
import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import { parse } from 'csv-parse/sync'
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
		projectedPoints: rankingData.Points
			? _.toNumber(rankingData.Points)
			: 'N/A',
		actualPoints: playerData.player_points?.total
			? _.toNumber(playerData.player_points.total)
			: 'N/A',
	}
}

async function theQuery() {
	const { access_token } = await getAccessToken()
	try {
		const { data } = await axios.get(
			`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;is_available=1/leagues/teams/players;out=stats`,
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

async function getMyTeam() {
	const anth = process.argv[2] === 'anth'
	const rankingsCsv = await readFile(
		anth ? 'data/anth.csv' : 'data/goblet.csv',
		'utf8'
	)
	const rankings = parse(rankingsCsv, {
		columns: true,
		bom: true,
	})

	try {
		const response = await theQuery()
		let players =
			response?.fantasy_content?.users?.user?.games?.game?.leagues
				?.league[anth ? 1 : 0]?.teams?.team?.players?.player

		players = players.map((p) => {
			const rankingData = rankings.find(
				(r) =>
					p.name.full === (r.Name ?? r['Player Name']) &&
					p.editorial_team_abbr.toLowerCase() === r.Team.toLowerCase()
			)

			return playerFactory(p, rankingData)
		})

		players = _.orderBy(players, 'projectedRank')

		const positionCounts = getPositionCounts(players)

		return [players, positionCounts]
	} catch (err) {
		console.error(err)
		if (err.response.status === 999) {
			console.error('We got rate limited! Killing the process.')
			process.exit(1)
		}
	}
}

function getPositionCounts(players) {
	const positions = players.flatMap((p) => p.position.split(','))
	let positionCounts = _.groupBy(positions)
	positionCounts = _.mapValues(
		positionCounts,
		(positions) => positions.length
	)
	positionCounts = _.map(positionCounts, (count, position) => ({
		position,
		count,
	}))
	positionCounts = _.orderBy(positionCounts, 'count', 'desc')
	return positionCounts
}

async function main() {
	try {
		console.log(`Fetching your team...`)
		const [players, positionCounts] = await getMyTeam()

		console.table(positionCounts)
		console.table(players)
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
