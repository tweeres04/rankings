import { useEffect, useState } from 'react'
import { get } from 'idb-keyval'

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

	return { filters, setFilter, clearFilters, isLoading }
}
