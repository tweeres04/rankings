import readline from 'readline'
import { exec } from 'child_process'
import { URLSearchParams } from 'url'
import { writeFile, readFile } from 'fs/promises'
import axios from 'axios'

const tokenFile = 'data/token'

export async function getAccessToken() {
	try {
		const data = await readFile(tokenFile, { encoding: 'utf8' })
		return JSON.parse(data)
	} catch (err) {
		exec(
			`open 'https://api.login.yahoo.com/oauth2/request_auth?client_id=${process.env.YAHOO_CLIENT_ID}&redirect_uri=oob&response_type=code'`
		)

		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
		})
		return new Promise((resolve) => {
			rl.question('Paste the access code\n', async (code) => {
				const {
					data: { access_token, refresh_token },
				} = await axios
					.post(
						'https://api.login.yahoo.com/oauth2/get_token',
						new URLSearchParams({
							grant_type: 'authorization_code',
							code,
							redirect_uri: 'oob',
						}).toString(),
						{
							auth: {
								username: process.env.YAHOO_CLIENT_ID,
								password: process.env.YAHOO_CLIENT_SECRET,
							},
						}
					)
					.catch((err) => {
						console.error(err)
					})

				writeFile(tokenFile, JSON.stringify({ access_token, refresh_token }))

				rl.close()

				resolve({ access_token, refresh_token })
			})
		})
	}
}

export async function refreshTheToken() {
	const { refresh_token } = await getAccessToken()

	const {
		data: { access_token, refresh_token: newRefreshToken },
	} = await axios
		.post(
			'https://api.login.yahoo.com/oauth2/get_token',
			new URLSearchParams({
				grant_type: 'refresh_token',
				refresh_token,
				redirect_uri: 'oob',
			}).toString(),
			{
				auth: {
					username: process.env.YAHOO_CLIENT_ID,
					password: process.env.YAHOO_CLIENT_SECRET,
				},
			}
		)
		.catch((err) => {
			console.error(err)
		})

	writeFile(
		tokenFile,
		JSON.stringify({ access_token, refresh_token: newRefreshToken })
	)

	return { access_token, refresh_token: newRefreshToken }
}
