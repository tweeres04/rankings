import { useEffect, useState } from 'react'
import { get, set } from 'idb-keyval'

import playerKey from '../playerKey'

export default function useCrossedOff(storageKey) {
	const [crossedOff, setCrossedOff] = useState({})
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		async function getCrossedOff() {
			const crossedOff = (await get(storageKey)) || {}
			setCrossedOff(crossedOff)
			setIsLoading(false)
		}

		getCrossedOff()
	}, [storageKey])

	useEffect(() => {
		if (!isLoading) {
			set(storageKey, crossedOff)
		}
	}, [crossedOff, isLoading, storageKey])

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
