import { useEffect } from 'react'
import { useFreshSheetsRankings } from './useFreshSheetsRankings'
import DatasetTable from './DatasetTable'
import PositionGroups from './PositionGroups'
import MyTeam from './MyTeam'
import useCrossedOff from './Drafter/useCrossedOff'
import Filters from './Drafter/Filters'
import useFilters from './Drafter/useFilters'
import Footer from './Footer'

function useNoIndex() {
	useEffect(() => {
		const noIndexTag = document.createElement('meta')
		noIndexTag.name = 'robots'
		noIndexTag.content = 'noindex'
		document.head.appendChild(noIndexTag)
	}, [])
}

export default function Drafter() {
	useNoIndex()

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

	const { isLoading: isLoadingCrossedOff } = crossedOffData
	const { isLoading: isLoadingMyTeam } = myTeamData
	const { isLoading: isLoadingFilters } = filtersData

	const isLoading =
		isLoadingFreshSheetsRankingsData ||
		isLoadingCrossedOff ||
		isLoadingFilters ||
		isLoadingMyTeam

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
					<div className="col-md-3 d-flex flex-column gap-1">
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
							Clear crossed off/my team
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col col-md-9 order-last order-md-first">
						{isLoading ? (
							<LoadingSpinner />
						) : filtersData.filters.view === 'list' ? (
							<DatasetTable
								rankingsData={freshSheetsRankingsData}
								crossedOffData={crossedOffData}
								myTeamData={myTeamData}
								filtersData={filtersData}
							/>
						) : (
							<PositionGroups
								rankingsData={freshSheetsRankingsData}
								crossedOffData={crossedOffData}
								myTeamData={myTeamData}
								filtersData={filtersData}
							/>
						)}
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

function LoadingSpinner() {
	return (
		<div className="d-flex justify-content-center mt-5">
			<div className="spinner-border"></div>
		</div>
	)
}
