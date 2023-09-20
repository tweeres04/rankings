import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { get, set } from 'idb-keyval'

import DatasetTable from './DatasetTable'
import useCrossedOff from './DatasetTable/useCrossedOff'

function useDataset() {
	const [dataset, setDataset] = useState()
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getDataset() {
			const dataset = await get('dataset')
			setDataset(dataset ?? 'players')
			setLoading(false)
		}
		getDataset()
	}, [])

	useEffect(() => {
		set('dataset', dataset)
	}, [dataset])

	return { dataset, setDataset, loading }
}

export default function Drafter() {
	const { dataset, setDataset, loading: loadingDataset } = useDataset()
	const crossedOffData = useCrossedOff()
	return loadingDataset ? null : (
		<>
			<div className="container">
				<h1 className="mb-3">Drafter</h1>
				<ul className="nav nav-tabs mb-3">
					<li className="nav-item">
						<button
							className={clsx('nav-link', {
								active: dataset === 'players',
							})}
							onClick={() => setDataset('players')}
						>
							Players
						</button>
					</li>
					<li className="nav-item">
						<button
							className={clsx('nav-link', {
								active: dataset === 'goalies',
							})}
							onClick={() => setDataset('goalies')}
						>
							Goalies
						</button>
					</li>
				</ul>
			</div>
			<DatasetTable
				dataset="players"
				activeDataset={dataset}
				crossedOffData={crossedOffData}
			/>
			<DatasetTable
				dataset="goalies"
				activeDataset={dataset}
				crossedOffData={crossedOffData}
			/>
		</>
	)
}
