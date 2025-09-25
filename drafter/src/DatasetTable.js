import clsx from 'clsx'

import playerKey from './playerKey'
import { ToggleCrossOff, ToggleCrossOffMyTeam } from './crossedOffButtons'

// todo: only show points if it's a points league
const headers = ['Rank', 'Name', 'Team', 'Pos', 'Points', 'VORP']

export default function DatasetTable({
	rankingsData,
	crossedOffData,
	myTeamData,
	filtersData,
}) {
	const { crossedOff, toggleCrossedOff } = crossedOffData
	const { rankings } = rankingsData
	const { crossedOff: myTeam, toggleCrossedOff: toggleMyTeam } = myTeamData
	const { isFilteredOut } = filtersData

	return rankings ? (
		<div class="table-responsive" style={{ height: '120dvh' }}>
			<table className="table">
				<thead className="sticky-top bg-white">
					<tr>
						{headers.map((key) => {
							const cellClass = clsx({
								'text-end': key === 'Points',
							})
							return (
								<th key={key} className={cellClass}>
									{key}
								</th>
							)
						})}
						<th style={{ width: 150 }}></th>
					</tr>
				</thead>
				<tbody>
					{rankings.map((ranking) => {
						let isFilteredOut_ = isFilteredOut(
							crossedOff,
							myTeam,
							ranking
						)
						const key = playerKey(ranking)
						const isCrossedOff = crossedOff[key]
						const isOnMyTeam = myTeam[key]
						const rowClass = clsx({
							'table-secondary': isCrossedOff || isOnMyTeam,
							'd-none': isFilteredOut_,
						})
						return (
							<tr key={key} className={rowClass}>
								{headers.map((header) => {
									const cellClass = clsx({
										'text-end': header === 'Points',
									})
									return (
										<td key={header} className={cellClass}>
											{isCrossedOff || isOnMyTeam ? (
												<s>{ranking[header]}</s>
											) : (
												ranking[header]
											)}
										</td>
									)
								})}
								<td
									className="text-end"
									style={{ minWidth: '20rem' }}
								>
									<ToggleCrossOffMyTeam
										{...{
											isOnMyTeam,
											isCrossedOff,
											toggleMyTeam,
											toggleCrossedOff,
											ranking,
										}}
									/>{' '}
									<ToggleCrossOff
										{...{
											isOnMyTeam,
											isCrossedOff,
											toggleMyTeam,
											toggleCrossedOff,
											ranking,
										}}
									/>
								</td>
							</tr>
						)
					})}
				</tbody>
			</table>
		</div>
	) : null
}
