import playerKey from './playerKey'

export default function MyTeam({ playersRankingsData, myTeamData }) {
	const { crossedOff: myTeam, isLoading: isLoadingMyTeam } = myTeamData
	const {
		rankings: playerRankings = [],
		isLoading: isLoadingPlayerRankings,
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

	// Todo: fetch this from Fresh Sheets
	const positionTotals = {
		F: 6,
		C: 2,
		RW: 2,
		LW: 2,
		D: 4,
		G: 2,
	}

	return isLoading ? null : playerRankings.length > 0 ? (
		<>
			<h5>My team ({myTeamKeys.length})</h5>
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
			<h5>Counts</h5>
			<p className="mb-0" style={{ fontSize: '0.8em' }}>
				To do: use position counts from fresh sheets
			</p>
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
							<td className="text-end">
								{positionCounts[pos]}/{positionTotals[pos]}
							</td>
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
	) : null
}
