import { useFreshSheetsRankings } from './useFreshSheetsRankings'
import DatasetTable from './DatasetTable'
import MyTeam from './MyTeam'
import useCrossedOff from './Drafter/useCrossedOff'
import Filters from './Drafter/Filters'
import useFilters from './Drafter/useFilters'
import Footer from './Footer'

export default function Drafter() {
	const crossedOffData = useCrossedOff('crossedOff')
	const myTeamData = useCrossedOff('myTeam')

	const freshSheetsRankingsData = useFreshSheetsRankings()
	const {
		rankings,
		startAuthorizeAndRefreshRankings,
		isLoading: isLoadingFreshSheetsRankingsData,
		GoogleSheetIdModal,
	} = freshSheetsRankingsData
	const filtersData = useFilters()

	return (
		<>
			<div className="container">
				<h1 className="mb-3">Drafter</h1>
				<div className="row g-4 align-items-center mb-3">
					<div className="col-md">
						<Filters
							rankings={rankings}
							filtersData={filtersData}
						/>
					</div>
					<div className="col-md-auto">
						{!isLoadingFreshSheetsRankingsData ? (
							<button
								className="btn btn-outline-primary"
								onClick={startAuthorizeAndRefreshRankings}
							>
								{rankings ? <>Refresh</> : <>Fetch</>} data from
								FreshSheets
							</button>
						) : null}{' '}
						<button
							className="btn btn-outline-danger"
							onClick={() => {
								crossedOffData.clearCrossedOff()
								myTeamData.clearCrossedOff()
							}}
						>
							Reset Drafter
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col col-md-9 order-last order-md-first">
						<DatasetTable
							rankingsData={freshSheetsRankingsData}
							crossedOffData={crossedOffData}
							myTeamData={myTeamData}
							filtersData={filtersData}
						/>
					</div>
					<div className="col order-first order-md-last">
						<MyTeam
							playersRankingsData={freshSheetsRankingsData}
							myTeamData={myTeamData}
						/>
					</div>
				</div>
			</div>
			<Footer />
			<GoogleSheetIdModal />
		</>
	)
}
