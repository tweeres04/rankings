import dotenv from 'dotenv'
import axios from 'axios'
import { parseStringPromise } from 'xml2js'
import { writeFile } from 'fs/promises'

dotenv.config()

import { getAccessToken, refreshTheToken } from './auth.js'

function playerFactory(playerData) {
	return {
		key: playerData.player_key,
		name: playerData.name.full,
		position: playerData.display_position,
		team: playerData.editorial_team_abbr,
	}
}

async function getPlayers(page = 0, pageSize = 25) {
	if (page % 5 === 0) {
		console.log(`Fetching page ${page}`)
	}
	const { access_token } = await getAccessToken()
	let players = []
	try {
		const { data } = await axios.get(
			`https://fantasysports.yahooapis.com/fantasy/v2/users;use_login=1/games;is_available=1/leagues/players;count=100;start=${
				page * pageSize
			}`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		)

		const response = await parseStringPromise(data, {
			explicitArray: false,
			emptyTag: null,
		})

		players =
			response?.fantasy_content?.users?.user?.games?.game?.leagues
				?.league[0]?.players?.player

		players = players.map(playerFactory)

		return players.length < 25
			? players
			: [...players, ...(await getPlayers(page + 1))]
	} catch (err) {
		if (err?.response?.status === 401) {
			await refreshTheToken()
			return getPlayers()
		}
		if (err?.response?.status === 400) {
			console.error(err.message)
			return players
		}

		throw err
	}
}

async function main() {
	try {
		console.log('Fetching players')
		const results = await getPlayers()

		await writeFile('data/players.json', JSON.stringify(results, null, 2))

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
