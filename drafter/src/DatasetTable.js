import clsx from 'clsx'

import Filters from './DatasetTable/Filters'
import useRankings from './DatasetTable/useRankings'
import useFilters from './DatasetTable/useFilters'
import playerKey from './DatasetTable/playerKey'

const headers = ['Rank', 'Player', 'Team', 'Pos', 'Points']

export default function DatasetTable({
	dataset,
	activeDataset,
	crossedOffData,
}) {
	const {
		rankings,
		isLoading: isLoadingRankings,
		positions,
	} = useRankings(dataset)
	const {
		crossedOff,
		toggleCrossedOff,
		isLoading: isLoadingCrossedOff,
		clearCrossedOff,
	} = crossedOffData
	const {
		filters,
		setFilter,
		clearFilters,
		isLoading: isLoadingFilters,
	} = useFilters()

	const isLoading =
		isLoadingRankings || isLoadingCrossedOff || isLoadingFilters

	return isLoading ? (
		activeDataset === dataset ? (
			<LoadingSpinner />
		) : null
	) : (
		<div
			className={clsx('container', {
				'd-none': activeDataset !== dataset,
			})}
		>
			<Filters
				filters={filters}
				setFilter={setFilter}
				clearFilters={clearFilters}
				positions={positions}
				clearCrossedOff={clearCrossedOff}
			/>
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
						const rowClass = clsx({
							'table-secondary': isCrossedOff,
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
											{isCrossedOff ? (
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
								<td className="text-end">
									<button
										className="btn btn-primary"
										onClick={() => {
											toggleCrossedOff(ranking)
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
		</div>
	)
}

function LoadingSpinner() {
	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="spinner-border"></div>
		</div>
	)
}
