export default function Filters({
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
