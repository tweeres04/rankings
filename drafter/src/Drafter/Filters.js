import { useEffect, useRef } from 'react'
import { uniq, orderBy } from 'lodash'

function useSearchKeyboardShortcut(setFilter, searchRef) {
	useEffect(() => {
		function handleKeyPress(event) {
			if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
				event.preventDefault()
				setFilter('search', '')
				searchRef.current.focus()
			}
		}

		document.addEventListener('keydown', handleKeyPress)

		return () => {
			document.removeEventListener('keydown', handleKeyPress)
		}
	})
}

export default function Filters({ rankings, filtersData }) {
	const { filters, setFilter, clearFilters } = filtersData
	const searchRef = useRef()
	useSearchKeyboardShortcut(setFilter, searchRef)

	let positions = rankings
		? rankings.flatMap(({ Pos }) => Pos.split('/'))
		: []
	positions = uniq(positions)
	positions = orderBy(positions)

	return (
		<>
			<div className="row g-4 align-items-center">
				<div className="col">
					<select
						name="Position"
						id="position"
						className="form-select"
						value={filters.position || ''}
						onChange={(event) => {
							setFilter('position', event.target.value)
						}}
					>
						<option value="">All positions</option>
						{(positions ?? []).map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</select>
				</div>
				<div className="col">
					<select
						name="crossedOff"
						id="crossedOff"
						className="form-select"
						value={filters.crossedOff || ''}
						onChange={(event) => {
							setFilter('crossedOff', event.target.value)
						}}
					>
						<option value="">All players</option>
						<option value="notCrossedOff">Not crossed off</option>
						<option value="crossedOff">Crossed off only</option>
					</select>
				</div>
				<div className="col-auto">
					<button
						className="btn btn-outline-secondary"
						onClick={clearFilters}
					>
						Reset filters
					</button>
				</div>
			</div>
			<div className="row mt-3">
				<div className="col">
					<input
						className="form-control"
						id="search"
						placeholder="Search (Cmd/Ctrl + K)"
						value={filters.search || ''}
						ref={searchRef}
						onChange={(event) => {
							setFilter('search', event.target.value)
						}}
					/>
				</div>
				<div class="col-auto">
					<button
						className="btn btn-outline-secondary"
						onClick={() => {
							setFilter('search', '')
							searchRef.current.focus()
						}}
					>
						Clear search
					</button>
				</div>
			</div>
		</>
	)
}
