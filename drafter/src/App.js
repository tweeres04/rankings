import clsx from 'clsx'

import Filters from './App/Filters'
import useRankings from './App/useRankings'
import useCrossedOff from './App/useCrossedOff'
import useFilters from './App/useFilters'
import playerKey from './App/playerKey'

const headers = ['Rank', 'Name', 'Team', 'Pos', 'Points']

export default function App() {
	const { rankings, isLoading: isLoadingRankings, positions } = useRankings()
	const {
		crossedOff,
		toggleCrossedOff,
		isLoading: isLoadingCrossedOff,
		clearCrossedOff,
	} = useCrossedOff()
	const {
		filters,
		setFilter,
		clearFilters,
		isLoading: isLoadingFilters,
	} = useFilters()

	const isLoading =
		isLoadingRankings || isLoadingCrossedOff || isLoadingFilters

	return isLoading ? (
		<LoadingSpinner />
	) : (
		<div className="container">
			<h1 className="mb-3">Drafter</h1>
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
								ranking.Pos !== filters.position) ||
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
