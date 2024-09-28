import Footer from './Footer'

export default function Homepage() {
	return (
		<>
			<div className="container">
				<div className="row" style={{ margin: '10rem 0' }}>
					<div className="col-lg">
						<h1>Make your fantasy hockey draft easy</h1>
						<p>
							Cross drafted players off. Filter by position. Track
							positions you've drafted. Powered by FreshSheets
							rankings.
						</p>
						<a className="btn btn-primary btn-lg" href="/app">
							Start drafting
						</a>
					</div>
					<div className="col-lg col-xl-8 mt-lg-0 mt-5">
						<img
							alt="Screenshot of drafter"
							src="/og.png"
							style={{ maxWidth: 700 }}
							className="d-block mx-auto w-100"
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}
