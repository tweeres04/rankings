import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { uniq, orderBy } from 'lodash'

export default function useRankings() {
	const [rankings, setRankings] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function getData() {
			const playerDataPromise = fetch('/data/players.json')
			Papa.parse('/data/goblet.csv', {
				download: true,
				header: true,
				complete: async ({ data }) => {
					const allPlayerData = await playerDataPromise.then(
						(response) => response.json()
					)

					const result = data.map((ranking) => {
						let foundPosition = true
						let playerData = allPlayerData.filter(
							(pd) =>
								pd.name.toLowerCase() ===
								ranking.Name.toLowerCase()
						)

						if (playerData.length > 1) {
							playerData = playerData.filter(
								(pd) =>
									pd.team.toLowerCase() ===
									ranking.Team.toLowerCase()
							)
						}

						if (!playerData[0]) {
							foundPosition = false
							console.log(
								`Couldn't get position for ${ranking.Name} - ${ranking.Team}`
							)
						}

						return {
							...ranking,
							Pos: playerData[0]?.position ?? ranking.Pos,
							foundPosition,
						}
					})

					setRankings(result)
					setIsLoading(false)
				},
			})
		}
		getData()
	}, [])

	let positions = rankings.flatMap(({ Pos }) => Pos.split(','))
	positions = uniq(positions)
	positions = orderBy(positions)

	return { rankings, positions, isLoading }
}
