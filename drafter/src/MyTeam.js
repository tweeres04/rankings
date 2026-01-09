import playerKey from './playerKey'

export default function MyTeam({ playersRankingsData, myTeamData }) {
	const { crossedOff: myTeam, isLoading: isLoadingMyTeam } = myTeamData
	const {
		rankings: playerRankings = [],
		isLoading: isLoadingPlayerRankings,
		positionTotals,
	} = playersRankingsData

	const isLoading = isLoadingPlayerRankings || isLoadingMyTeam

	const myTeamKeys = Object.keys(myTeam).filter((key) => myTeam[key])

	const positionCounts =
		playerRankings.length > 0
			? myTeamKeys.reduce(
					(counts, key) => {
						let ranking = playerRankings.find(
							(r) => playerKey(r) === key
						)

						if (!ranking) {
							return counts
						}

						const positions = ranking.Pos.split('/')

						const isForward = positions.some((p) =>
							['C', 'LW', 'RW'].some((p_) => p === p_)
						)

						if (isForward) {
							counts['F'] = counts['F'] + 1
						}

						positions.forEach((pos) => {
							counts[pos] = counts[pos] + 1
						})

						return counts
					},
					{ F: 0, D: 0, G: 0, C: 0, RW: 0, LW: 0 }
			  )
			: {}

	return isLoading ? null : playerRankings.length > 0 ? (
		<>
			<h5>My team ({myTeamKeys.length})</h5>
			{myTeamKeys.length < 1 ? <p>No players selected yet</p> : null}
			<ul>
				{myTeamKeys.map((k) => {
					let ranking = playerRankings.find((r) => playerKey(r) === k)
					return (
						<li key={k}>
							{ranking.Name} - {ranking.Pos}
						</li>
					)
				})}
			</ul>
			<h5>Position Counts</h5>
			<table className="table">
				<thead>
					<tr>
						<th>Pos</th>
						<th className="text-end">Count</th>
						<th className="text-end">%</th>
					</tr>
				</thead>
				<tbody>
					{Object.keys(positionCounts)
						.toSorted()
						.map((pos) =>
							positionTotals[pos] > 0 ? (
								<tr key={pos}>
									<td>{pos}</td>
									<td className="text-end">
										{positionCounts[pos]}/
										{positionTotals[pos]}
									</td>
									<td className="text-end">
										{(
											(positionCounts[pos] /
												positionTotals[pos]) *
											100
										).toFixed(1)}
									</td>
								</tr>
							) : null
						)}
				</tbody>
			</table>
		</>
	) : null
}
