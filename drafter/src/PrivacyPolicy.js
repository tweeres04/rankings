import Footer from './Footer'

export default function PrivacyPolicy() {
	return (
		<>
			<div
				className="container"
				style={{ marginTop: '10rem', marginBottom: '10rem' }}
			>
				<h1>Drafter Privacy Policy</h1>
				<ul>
					<li>
						I don't have access to any of your data — it's only
						stored locally in your browser for application use.
					</li>
					<li>
						I will likely collect anonymous product usage data in
						the future in order to improve the product
					</li>
					<li>I won't sell or give away any personal information</li>
				</ul>
			</div>
			<Footer />
		</>
	)
}
