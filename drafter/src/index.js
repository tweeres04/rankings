import React from 'react'
import { createRoot } from 'react-dom/client'
import Homepage from './Homepage'
import Drafter from './Drafter'
import reportWebVitals from './reportWebVitals'
import PrivacyPolicy from './PrivacyPolicy'
import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN, {
	debug: process.env.NODE_ENV !== 'production',
	track_pageview: true,
	persistence: 'localStorage',
	record_sessions_percent: 1, //records 1% of all sessions
	record_heatmap_data: true,
})

const container = document.getElementById('root')
const root = createRoot(container)

if (window.location.pathname === '/privacy-policy') {
	root.render(<PrivacyPolicy />)
} else if (window.location.pathname === '/app') {
	root.render(<Drafter />)
} else {
	root.render(<Homepage />)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
