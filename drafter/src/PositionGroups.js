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

function DifferenceRow({ differenceFrom, label, n }) {
	return (
		<tr>
			<td>{label}:</td>
			<td>
				{differenceFrom(n)
					? `${differenceFrom(n) > 0 ? '+' : ''}${differenceFrom(
							n
					  ).toFixed(1)}`
					: 'N/A'}
			</td>
		</tr>
	)
}

export default function PositionGroups({
	rankingsData,
	crossedOffData,
	myTeamData,
	filtersData,
}) {
	const [showTopTen, setShowTopTen] = useState(false)
	const { isFilteredOut, filters } = filtersData
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
						const rankingsToShow = showTopTen
							? groupedRankings[pos].slice(0, 10)
							: groupedRankings[pos].slice(0, 1)
						return (
							<div className="col-sm-4 mb-3">
								<h2 className="mb-0 fs-4">{pos}</h2>
								<ol className="list-group list-group-flush">
									{rankingsToShow.map((r, i) => {
										const key = playerKey(r)
										const isCrossedOff = crossedOff[key]
										const isOnMyTeam = myTeam[key]
										const differenceFrom = (rank) =>
											groupedRankings[pos][rank]
												? r.VORP -
												  groupedRankings[pos][rank]
														.VORP
												: null
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
																{filters.search
																	?.length >
																0 ? null : (
																	<>
																		<div>
																			Compared
																			to:
																		</div>
																		<table className="ms-2">
																			<DifferenceRow
																				{...{
																					differenceFrom,
																					label: '2nd',
																					n: 1,
																				}}
																			/>
																			<DifferenceRow
																				{...{
																					differenceFrom,
																					label: '5th',
																					n: 4,
																				}}
																			/>
																			<DifferenceRow
																				{...{
																					differenceFrom,
																					label: '10th',
																					n: 9,
																				}}
																			/>
																			<DifferenceRow
																				{...{
																					differenceFrom,
																					label: '20th',
																					n: 19,
																				}}
																			/>
																			<DifferenceRow
																				{...{
																					differenceFrom,
																					label: '50th',
																					n: 49,
																				}}
																			/>
																		</table>
																	</>
																)}
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
