import { useState, useEffect } from 'react'
import clsx from 'clsx'
import { get, set } from 'idb-keyval'

import DatasetTable from './DatasetTable'
import MyTeam from './MyTeam'
import useCrossedOff from './Drafter/useCrossedOff'
import Filters from './Drafter/Filters'
import useFilters from './Drafter/useFilters'
import useRankings from './Drafter/useRankings'

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
	const crossedOffData = useCrossedOff('crossedOff')
	const myTeamData = useCrossedOff('myTeam')
	const { dataset, setDataset } = useDataset()
	const playersRankingsData = useRankings('players')
	const goaliesRankingsData = useRankings('goalies')
	const activeRankingsData =
		dataset === 'players'
			? playersRankingsData
			: dataset === 'goalies'
			? goaliesRankingsData
			: {}
	const filtersData = useFilters()
	return (
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
				<Filters
					filtersData={filtersData}
					positions={activeRankingsData.positions}
					clearCrossedOff={crossedOffData.clearCrossedOff}
					clearMyTeam={myTeamData.clearCrossedOff}
				/>
				<div className="row">
					<div className="col-9">
						<DatasetTable
							rankingsData={activeRankingsData}
							dataset={dataset}
							crossedOffData={crossedOffData}
							myTeamData={myTeamData}
							filtersData={filtersData}
						/>
					</div>
					<div className="col">
						<MyTeam
							playersRankingsData={playersRankingsData}
							goaliesRankingsData={goaliesRankingsData}
							myTeamData={myTeamData}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
