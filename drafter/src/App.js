import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { get, set } from 'idb-keyval'
import { uniq, orderBy } from 'lodash'
import clsx from 'clsx'

function playerKey(player) {
	return `${player.Player}${player.Team}`
}

function useRankings() {
	const [rankings, setRankings] = useState([])
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		Papa.parse('/data/goblet.csv', {
			download: true,
			header: true,
			complete: ({ data }) => {
				setRankings(data)
				setIsLoading(false)
			},
		})
	}, [])

	let positions = rankings.map(({ Pos }) => Pos)
	positions = uniq(positions)
	positions = orderBy(positions)

	return { rankings, positions, isLoading }
}

function useCrossedOff() {
	const [crossedOff, setCrossedOff] = useState({})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function getCrossedOff() {
			const crossedOff = (await get('crossedOff')) || {}
			setCrossedOff(crossedOff)
			setIsLoading(false)
		}

		getCrossedOff()
	}, [])

	useEffect(() => {
		if (!isLoading) {
			set('crossedOff', crossedOff)
		}
	}, [crossedOff, isLoading])

	function toggleCrossedOff(player) {
		setCrossedOff((crossedOff) => ({
			...crossedOff,
			[playerKey(player)]: !crossedOff[playerKey(player)],
		}))
		setIsLoading(false)
	}

	function clearCrossedOff() {
		setCrossedOff({})
	}

	return { crossedOff, toggleCrossedOff, clearCrossedOff, isLoading }
}

function useFilters() {
	const [filters, setFilters] = useState({})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function getFilters() {
			const filters = (await get('filters')) || {}
			setFilters(filters)
			setIsLoading(false)
		}

		getFilters()
	}, [])

	function setFilter(filter, value) {
		setFilters((filters) => ({
			...filters,
			[filter]: value,
		}))
	}

	function clearFilters() {
		setFilters({})
	}

	return { filters, setFilter, clearFilters, isLoading }
}

const headers = ['Rank', 'Player', 'Team', 'Pos', 'Points']

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
						{headers.map((key) => (
							<th key={key}>{key}</th>
						))}
						<th style={{ width: 150 }}></th>
					</tr>
				</thead>
				<tbody>
					{rankings.map((ranking) => {
						let isFilteredOut =
							(filters.position &&
								ranking.Pos !== filters.position) ||
							(filters.hideCrossedOff &&
								crossedOff[playerKey(ranking)])
						const isCrossedOff = crossedOff[playerKey(ranking)]
						const rowClass = clsx({
							'table-secondary': isCrossedOff,
							'd-none': isFilteredOut,
						})
						return (
							<tr key={playerKey(ranking)} className={rowClass}>
								{headers.map((header) => (
									<td key={header}>
										{isCrossedOff ? (
											<s>{ranking[header]}</s>
										) : (
											ranking[header]
										)}
									</td>
								))}
								<td>
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

function Filters({
	filters,
	setFilter,
	clearFilters,
	positions,
	clearCrossedOff,
}) {
	return (
		<div className="row g-4 align-items-center mb-3">
			<div className="col-md-3">
				<select
					name="Position"
					id="position"
					className="form-select"
					value={filters.position || ''}
					onChange={(event) => {
						setFilter('position', event.target.value)
					}}
				>
					<option value="">Position...</option>
					{positions.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</select>
			</div>
			<div className="col-auto">
				<div className="form-check">
					<input
						type="checkbox"
						className="form-check-input"
						checked={filters.hideCrossedOff || false}
						id="crossedOffCheck"
						onChange={(event) => {
							setFilter('hideCrossedOff', event.target.checked)
						}}
					/>
					<label
						htmlFor="crossedOffCheck"
						className="form-check-label"
					>
						Hide crossed off
					</label>
				</div>
			</div>
			<div className="col">
				<button
					className="btn btn-outline-secondary"
					onClick={clearFilters}
				>
					Reset filters
				</button>
			</div>
			<div className="col-auto">
				<button
					className="btn btn-outline-danger"
					onClick={clearCrossedOff}
				>
					Reset crossed off players
				</button>
			</div>
		</div>
	)
}
