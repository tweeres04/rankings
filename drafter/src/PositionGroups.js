import { useState } from 'react'
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
	const [showTopTen, setShowTopTen] = useState(false)
	const { isFilteredOut } = filtersData
	const { rankings } = rankingsData
	const { crossedOff, toggleCrossedOff } = crossedOffData
	const { crossedOff: myTeam, toggleCrossedOff: toggleMyTeam } = myTeamData

	const filteredRankings = rankings
		? rankings.filter((r) => !isFilteredOut(crossedOff, myTeam, r))
		: []

	const groupedRankings = rankings ? groupRankings(filteredRankings) : []

	return rankings ? (
		<>
			<div className="row">
				<div className="col mb-2 text-end">
					<button
						className="btn btn-secondary"
						onClick={() => setShowTopTen((value) => !value)}
					>
						{showTopTen ? 'Hide' : 'Show'} top ten
					</button>
				</div>
			</div>
			<div className="row">
				{Object.keys(groupedRankings)
					.toSorted((a, b) => a.localeCompare(b))
					.map((pos) => {
						const topTen = groupedRankings[pos]
							.filter((r) => r)
							.slice(0, 10)
						const rankingsToShow = showTopTen
							? topTen
							: topTen.slice(0, 1)
						return (
							<div className="col-sm-4 mb-3">
								<h2 className="mb-0 fs-4">{pos}</h2>
								<ol className="list-group list-group-flush">
									{rankingsToShow.map((r, i) => {
										const key = playerKey(r)
										const isCrossedOff = crossedOff[key]
										const isOnMyTeam = myTeam[key]
										const differenceFromTwo =
											r.VORP - topTen[1].VORP
										const differenceFromFive =
											r.VORP - topTen[4].VORP
										const differenceFromTen =
											r.VORP - topTen[9].VORP
										return (
											<li
												key={r.Name}
												className="list-group-item px-0"
											>
												<div class="mb-1">
													{(() => {
														const content = (
															<>
																<div>
																	<strong>
																		{r.Name}
																	</strong>
																</div>
																<div>
																	{r.Team} -{' '}
																	{r.Pos}
																</div>
																<div>
																	VORP:{' '}
																	{r.VORP}
																</div>
																<div>
																	Compared to:
																</div>
																<table>
																	<tr>
																		<td>
																			2nd:
																		</td>
																		<td>
																			{differenceFromTwo >
																			0
																				? '+'
																				: ''}
																			{differenceFromTwo.toFixed(
																				1
																			)}
																		</td>
																	</tr>
																	<tr>
																		<td>
																			5th:
																		</td>
																		<td>
																			{differenceFromFive >
																			0
																				? '+'
																				: ''}
																			{differenceFromFive.toFixed(
																				1
																			)}
																		</td>
																	</tr>
																	<tr>
																		<td>
																			10th:
																		</td>
																		<td>
																			{differenceFromTen >
																			0
																				? '+'
																				: ''}
																			{differenceFromTen.toFixed(
																				1
																			)}
																		</td>
																	</tr>
																</table>
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
		</>
	) : null
}
