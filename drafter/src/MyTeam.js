import playerKey from './playerKey'

export default function MyTeam({
	playersRankingsData,
	goaliesRankingsData,
	myTeamData,
}) {
	const { crossedOff: myTeam, isLoading: isLoadingMyTeam } = myTeamData
	const { rankings: playerRankings, isLoading: isLoadingPlayerRankings } =
		playersRankingsData
	const { rankings: goalieRankings, isLoading: isLoadingGoalieRankings } =
		goaliesRankingsData

	const isLoading =
		isLoadingGoalieRankings || isLoadingPlayerRankings || isLoadingMyTeam

	const positionCounts =
		playerRankings && goalieRankings
			? Object.keys(myTeam).reduce((counts, key) => {
					let ranking = playerRankings.find(
						(r) => playerKey(r) === key
					)
					if (!ranking) {
						ranking = goalieRankings.find(
							(r) => playerKey(r) === key
						)
					}

					const positions = ranking.Pos.split(',')

					positions.forEach((pos) => {
						if (counts[pos]) {
							counts[pos] = counts[pos] + 1
						} else {
							counts[pos] = 1
						}
					})

					return counts
			  }, {})
			: {}

	const positionTotals = {
		C: 3,
		RW: 3,
		LW: 3,
		D: 4,
		G: 2,
	}

	return isLoading ? null : (
		<>
			<h5>My team ({Object.keys(myTeam).length})</h5>
			<ul>
				{Object.keys(myTeam).map((k) => {
					let ranking = playerRankings.find((r) => playerKey(r) === k)
					if (!ranking) {
						ranking = goalieRankings.find((r) => playerKey(r) === k)
					}
					return (
						<li key={k}>
							{ranking.Player} - {ranking.Pos}
						</li>
					)
				})}
			</ul>
			<h5>Counts</h5>
			<table className="table">
				<thead>
					<tr>
						<th>Pos</th>
						<th className="text-end">Count</th>
						<th className="text-end">%</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(positionCounts).map((pos) => (
						<tr key={pos}>
							<td>{pos}</td>
							<td className="text-end">{positionCounts[pos]}</td>
							<td className="text-end">
								{(
									(positionCounts[pos] /
										positionTotals[pos]) *
									100
								).toFixed(1)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}
