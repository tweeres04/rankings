import React from 'react'
import { createRoot } from 'react-dom/client'
import Drafter from './Drafter'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')
const root = createRoot(container)

if (window.location.pathname === '/privacy-policy') {
	root.render(
		<div className="container">
			<h1>Drafter Privacy Policy</h1>
			<ul>
				<li>
					I don't have access to any of your data — it's only stored
					locally in your browser for application use.
				</li>
				<li>
					I will likely collect anonymous product usage data in the
					future in order to improve the product
				</li>
				<li>I won't sell or give away any personal information</li>
			</ul>
		</div>
	)
} else {
	root.render(<Drafter />)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
