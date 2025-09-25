import { groupBy } from 'lodash'
import { ToggleCrossOff, ToggleCrossOffMyTeam } from './crossedOffButtons'
import playerKey from './playerKey'

function groupRankings(rankings) {
	const flattenedPlayers = rankings.flatMap((r) =>
		r.Pos.split('/').map((splitPos) => ({ ...r, splitPos }))
	)

	return groupBy(flattenedPlayers, 'splitPos')
}

export default function PositionGroups({
	rankingsData,
	crossedOffData,
	myTeamData,
	filtersData,
}) {
	const { isFilteredOut } = filtersData
	const { rankings } = rankingsData
	const { crossedOff, toggleCrossedOff } = crossedOffData
	const { crossedOff: myTeam, toggleCrossedOff: toggleMyTeam } = myTeamData

	const filteredRankings = rankings
		? rankings.filter((r) => !isFilteredOut(crossedOff, myTeam, r))
		: []

	const groupedRankings = rankings ? groupRankings(filteredRankings) : []

	return rankings ? (
		<div className="row">
			{Object.keys(groupedRankings)
				.toSorted((a, b) => a.localeCompare(b))
				.map((pos) => {
					const topTen = groupedRankings[pos]
						.filter((r) => r)
						.slice(0, 10)
					return (
						<div className="col-sm-4">
							<h2>{pos}</h2>
							<ol className="list-group list-group-flush list-group-numbered">
								{topTen.map((r) => {
									const key = playerKey(r)
									const isCrossedOff = crossedOff[key]
									const isOnMyTeam = myTeam[key]
									return (
										<li
											key={r.Name}
											className="list-group-item"
										>
											<div class="mb-1">
												{(() => {
													const content = (
														<>
															{r.Name} - {r.Team}{' '}
															- {r.Pos}
															<div>
																VORP: {r.VORP}
															</div>
														</>
													)
													return isCrossedOff ||
														isOnMyTeam ? (
														<s>{content}</s>
													) : (
														content
													)
												})()}
											</div>
											<ToggleCrossOffMyTeam
												{...{
													isOnMyTeam,
													isCrossedOff,
													toggleMyTeam,
													toggleCrossedOff,
												}}
												ranking={r}
											/>{' '}
											<ToggleCrossOff
												{...{
													isOnMyTeam,
													isCrossedOff,
													toggleMyTeam,
													toggleCrossedOff,
												}}
												ranking={r}
											/>
										</li>
									)
								})}
							</ol>
						</div>
					)
				})}
		</div>
	) : null
}
