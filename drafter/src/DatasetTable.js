import clsx from 'clsx'

import playerKey from './playerKey'

const headers = ['Rank', 'Player', 'Team', 'Pos', 'Points']

export default function DatasetTable({
	rankingsData,
	crossedOffData,
	myTeamData,
	filtersData,
}) {
	const {
		crossedOff,
		toggleCrossedOff,
		isLoading: isLoadingCrossedOff,
	} = crossedOffData
	const { rankings, isLoading: isLoadingRankings } = rankingsData
	const { crossedOff: myTeam, toggleCrossedOff: toggleMyTeam } = myTeamData
	const { filters, isLoading: isLoadingFilters } = filtersData

	const isLoading =
		isLoadingRankings || isLoadingCrossedOff || isLoadingFilters

	return isLoading ? (
		<LoadingSpinner />
	) : (
		<table className="table">
			<thead>
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
					const key = playerKey(ranking)
					let isFilteredOut =
						(filters.position &&
							ranking.Pos !== filters.position &&
							!ranking.Pos.split(',').includes(
								filters.position
							)) ||
						(filters.crossedOff &&
							filters.crossedOff === 'crossedOff' &&
							!crossedOff[key]) ||
						(filters.crossedOff === 'notCrossedOff' &&
							crossedOff[key])
					const isCrossedOff = crossedOff[key]
					const isOnMyTeam = myTeam[key]
					const rowClass = clsx({
						'table-secondary': isCrossedOff || isOnMyTeam,
						'd-none': isFilteredOut,
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
										) : header === 'Pos' &&
										  !ranking.foundPosition ? (
											<span className="text-danger">
												{ranking[header]}
											</span>
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
								<button
									className="btn btn-primary btn-sm"
									onClick={() => {
										toggleMyTeam(ranking)
										if (isCrossedOff) {
											toggleCrossedOff(ranking)
										}
									}}
								>
									{isOnMyTeam
										? 'Remove from my team'
										: 'Add to my team'}
								</button>{' '}
								<button
									className="btn btn-secondary btn-sm"
									onClick={() => {
										toggleCrossedOff(ranking)
										if (isOnMyTeam) {
											toggleMyTeam(ranking)
										}
									}}
								>
									{isCrossedOff
										? 'Un cross off'
										: 'Cross off'}
								</button>
							</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	)
}

function LoadingSpinner() {
	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="spinner-border"></div>
		</div>
	)
}
