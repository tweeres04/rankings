import { useEffect, useState } from 'react'
import Papa from 'papaparse'
import { uniq, orderBy } from 'lodash'

export default function useRankings() {
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
