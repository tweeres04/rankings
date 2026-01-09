export function ToggleCrossOffMyTeam({
	isOnMyTeam,
	isCrossedOff,
	toggleMyTeam,
	toggleCrossedOff,
	ranking,
}) {
	return (
		<button
			className="btn btn-primary btn-sm"
			onClick={() => {
				toggleMyTeam(ranking)
				if (isCrossedOff) {
					toggleCrossedOff(ranking)
				}
			}}
		>
			{isOnMyTeam ? 'Remove from my team' : 'Add to my team'}
		</button>
	)
}

export function ToggleCrossOff({
	isOnMyTeam,
	isCrossedOff,
	toggleMyTeam,
	toggleCrossedOff,
	ranking,
}) {
	return (
		<button
			className="btn btn-secondary btn-sm"
			onClick={() => {
				toggleCrossedOff(ranking)
				if (isOnMyTeam) {
					toggleMyTeam(ranking)
				}
			}}
		>
			{isCrossedOff ? 'Un cross off' : 'Cross off'}
		</button>
	)
}
