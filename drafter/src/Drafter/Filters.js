import { uniq, orderBy } from 'lodash'

export default function Filters({ rankings, filtersData }) {
	const { filters, setFilter, clearFilters } = filtersData

	let positions = rankings
		? rankings.flatMap(({ Pos }) => Pos.split('/'))
		: []
	positions = uniq(positions)
	positions = orderBy(positions)

	return (
		<div className="row g-4 align-items-center">
			<div className="col-auto">
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
			<div className="col-auto">
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
			<div className="col">
				<button
					className="btn btn-outline-secondary"
					onClick={clearFilters}
				>
					Reset filters
				</button>
			</div>
		</div>
	)
}
