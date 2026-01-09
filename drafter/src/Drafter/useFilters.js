import { useEffect, useState } from 'react'
import { get } from 'idb-keyval'
import playerKey from '../playerKey'

export default function useFilters() {
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

	function isFilteredOut(crossedOff, myTeam, ranking) {
		const key = playerKey(ranking)
		return (
			(filters.position &&
				ranking.Pos !== filters.position &&
				!ranking.Pos.split('/').includes(filters.position)) ||
			(filters.crossedOff &&
				filters.crossedOff === 'crossedOff' &&
				!crossedOff[key] &&
				!myTeam[key]) ||
			(filters.crossedOff === 'notCrossedOff' &&
				(crossedOff[key] || myTeam[key])) ||
			(filters.search &&
				filters.search !== '' &&
				!ranking.Name.toLowerCase().includes(
					filters.search.toLowerCase()
				))
		)
	}

	return { filters, setFilter, clearFilters, isLoading, isFilteredOut }
}
