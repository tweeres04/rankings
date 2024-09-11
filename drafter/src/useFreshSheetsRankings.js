/* global gapi, google */
import { useState, useEffect } from 'react'
import { get, set } from 'idb-keyval'
import { uniq, orderBy } from 'lodash'

function useGoogleScripts() {
	const [tokenClient, setTokenClient] = useState()
	const [gapiLoaded, setGapiLoaded] = useState()

	async function initializeGapiClient() {
		await gapi.client.init({
			apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
			discoveryDocs: [
				'https://sheets.googleapis.com/$discovery/rest?version=v4',
			],
		})
		setGapiLoaded(true)
	}

	function gisLoaded() {
		const tokenClient = google.accounts.oauth2.initTokenClient({
			client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
			scope: 'https://www.googleapis.com/auth/spreadsheets',
		})

		setTokenClient(tokenClient)
	}

	useEffect(() => {
		let script = document.createElement('script')
		script.src = 'https://apis.google.com/js/api.js'
		script.async = true
		script.onload = function () {
			gapi.load('client', initializeGapiClient)
		}
		document.body.appendChild(script)

		script = document.createElement('script')
		script.src = 'https://accounts.google.com/gsi/client'
		script.async = true
		script.onload = gisLoaded
		document.body.appendChild(script)
	}, [])

	return { isLoaded: tokenClient && gapiLoaded, tokenClient }
}

const fieldToFreshSheetsColumn = {
	Rank: 0,
	Name: 1,
	Team: 4,
	Pos: 5,
	Points: 10,
	VORP: 11,
}

export function useFreshSheetsRankings() {
	const { tokenClient } = useGoogleScripts()
	const [isLoading, setIsLoading] = useState(true)
	const [authorized, setAuthorized] = useState(false)
	const [rankings, setRankings] = useState()
	const [showModal, setShowModal] = useState(false)
	const [freshSheetsSheetId, setFreshSheetsSheetId] = useState()

	useEffect(() => {
		async function fetchFreshSheetsId() {
			const freshSheetsIdFromIdb = await get('freshSheetsId')
			setFreshSheetsSheetId(freshSheetsIdFromIdb)
		}

		fetchFreshSheetsId()
	}, [])

	useEffect(() => {
		async function fetchRankingsFromIdb() {
			const rankingsFromIdb = await get('rankings')
			setRankings(rankingsFromIdb)
			setIsLoading(false)
		}

		fetchRankingsFromIdb()
	}, [])

	function GoogleSheetIdModal() {
		function submit(event) {
			const formData = new FormData(event.target)
			const googleSheetId = formData.get('freshSheetsId')
			set('freshSheetsId', googleSheetId)
			setFreshSheetsSheetId(googleSheetId)
			setShowModal(false)
			authorizeAndFetchRankings(googleSheetId)
			closeModal()
		}

		function closeModal() {
			setShowModal(false)
		}

		return showModal ? (
			<>
				<div
					className="modal show"
					tabIndex="-1"
					style={{ display: 'block' }}
					onClick={(event) => {
						if (event.target.classList.contains('modal')) {
							closeModal()
						}
					}}
				>
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">
									Fetch rankings from your Fresh Sheets
								</h5>
								<button
									type="button"
									className="btn-close"
									aria-label="Close"
									onClick={closeModal}
								></button>
							</div>
							<form onSubmit={submit}>
								<div className="modal-body">
									<div className="mb-3">
										<label
											htmlFor="freshSheetsId"
											className="form-label"
										>
											Fresh Sheets Sheet ID
										</label>
										<input
											className="form-control"
											id="freshSheetsId"
											name="freshSheetsId"
											aria-describedby="freshSheetsIdHelp"
											defaultValue={freshSheetsSheetId}
										/>
										<div
											id="freshSheetsIdHelp"
											className="form-text"
										>
											<p className="mb-0">
												You can find the ID in the url
												of your sheet.
											</p>
											<p>
												Ex:
												https://docs.google.com/spreadsheets/d/
												<strong>{'{sheet id}'}</strong>
												/edit
											</p>
										</div>
									</div>
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={closeModal}
									>
										Close
									</button>
									<button className="btn btn-primary">
										Fetch
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
				<div className="modal-backdrop show"></div>
			</>
		) : null
	}

	function startAuthorizeAndRefreshRankings() {
		setShowModal(true)
	}

	function authorizeAndFetchRankings(freshSheetsSheetId) {
		async function fetchGoogleRankings() {
			try {
				const response =
					await gapi.client.sheets.spreadsheets.values.get({
						spreadsheetId: freshSheetsSheetId,
						range: 'Rankings!4:403',
					})

				const range = response.result
				const rankings = range.values.map((values) =>
					Object.keys(fieldToFreshSheetsColumn).reduce(
						(ranking, field) => ({
							...ranking,
							[field]: values[fieldToFreshSheetsColumn[field]],
						}),
						{}
					)
				)

				set('rankings', rankings)
				setRankings(rankings)
			} catch (err) {
				if (err.status === 403) {
					console.error(err)
					setAuthorized(false)
				} else {
					throw err
				}
			} finally {
				setIsLoading(false)
			}
		}
		tokenClient.callback = async (response) => {
			if (response.error !== undefined) {
				throw response
			}
			setAuthorized(true)
			fetchGoogleRankings()
		}

		setIsLoading(true)
		if (gapi.client.getToken() === null) {
			// Prompt the user to select a Google Account and ask for consent to share their data
			// when establishing a new session.
			tokenClient.requestAccessToken({
				prompt: 'consent',
			})
		} else {
			// Skip display of account chooser and consent dialog for an existing session.
			tokenClient.requestAccessToken({ prompt: '' })
		}
	}

	function revoke() {
		const token = gapi.client.getToken()
		if (token !== null) {
			google.accounts.oauth2.revoke(token.access_token)
			gapi.client.setToken('')
			setAuthorized(false)
		}
	}

	let positions = rankings
		? rankings.flatMap(({ Pos }) => Pos.split('/'))
		: []
	positions = uniq(positions)
	positions = orderBy(positions)

	return {
		GoogleSheetIdModal,
		rankings,
		startAuthorizeAndRefreshRankings,
		revoke,
		authorized,
		isLoading,
		positions,
	}
}
