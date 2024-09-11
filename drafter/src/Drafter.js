import { useFreshSheetsRankings } from './useFreshSheetsRankings'
import DatasetTable from './DatasetTable'
import MyTeam from './MyTeam'
import useCrossedOff from './Drafter/useCrossedOff'
import Filters from './Drafter/Filters'
import useFilters from './Drafter/useFilters'

export default function Drafter() {
	const crossedOffData = useCrossedOff('crossedOff')
	const myTeamData = useCrossedOff('myTeam')

	const freshSheetsRankingsData = useFreshSheetsRankings()
	const {
		rankings,
		startAuthorizeAndRefreshRankings,
		positions,
		isLoading: isLoadingFreshSheetsRankingsData,
		GoogleSheetIdModal,
	} = freshSheetsRankingsData
	const filtersData = useFilters()

	return (
		<>
			<div className="container">
				<h1 className="mb-3">Drafter</h1>
				<div className="row g-4 align-items-center mb-3">
					<div className="col">
						<Filters
							rankings={rankings}
							filtersData={filtersData}
							positions={positions}
						/>
					</div>
					<div className="col-auto">
						{!isLoadingFreshSheetsRankingsData ? (
							<button
								className="btn btn-outline-primary"
								onClick={startAuthorizeAndRefreshRankings}
							>
								{rankings ? <>Refresh</> : <>Fetch</>} Rankings
								from Fresh Sheets
							</button>
						) : null}{' '}
						<button
							className="btn btn-outline-danger"
							onClick={() => {
								crossedOffData.clearCrossedOff()
								myTeamData.clearMyTeam()
							}}
						>
							Reset Drafter
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col-9">
						<DatasetTable
							rankingsData={freshSheetsRankingsData}
							crossedOffData={crossedOffData}
							myTeamData={myTeamData}
							filtersData={filtersData}
						/>
					</div>
					<div className="col">
						<MyTeam
							playersRankingsData={freshSheetsRankingsData}
							myTeamData={myTeamData}
						/>
					</div>
				</div>
			</div>
			<GoogleSheetIdModal />
		</>
	)
}
