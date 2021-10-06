import { useEffect, useState } from 'react'
import { get, set } from 'idb-keyval'

import playerKey from './playerKey'

export default function useCrossedOff() {
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
