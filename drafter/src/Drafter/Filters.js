export default function Filters({
	filtersData,
	positions,
	clearCrossedOff,
	clearMyTeam,
}) {
	const { filters, setFilter, clearFilters } = filtersData
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
			<div className="col-auto">
				<button
					className="btn btn-outline-danger"
					onClick={() => {
						clearCrossedOff()
						clearMyTeam()
					}}
				>
					Reset Drafter
				</button>
			</div>
		</div>
	)
}
