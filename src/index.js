import 'isomorphic-fetch'
import 'isomorphic-form-data'

const TINDER_HOST = 'https://api.gotinder.com/'
const TINDER_IMAGE_HOST = 'https://imageupload.gotinder.com/'

class TinderClient {
	xAuthToken = null
	lastActivity = new Date()
	userId = null
	defaults = null

	get requestHeaders() {
		const headers = {
			'User-Agent': 'Tinder Android Version 4.5.5',
			os_version: '23',
			platform: 'android',
			'app-version': '854',
			'Accept-Language': 'en',
			'Content-Type': 'application/json'
		}

		if (this.xAuthToken !== null) {
			headers['X-Auth-Token'] = this.xAuthToken
		}

		return new Headers(headers)
	}

	get requestImageHeaders() {
		const headers = this.requestHeaders
			.entries()
			.reduce((headersObject, [key, value]) => {
				headersObject[key] = value
			}, {})

		headers.set('Content-Type', 'multipart/form-data')

		return headers
	}

	async http({ path, method, data }) {
		const res = await fetch(`${TINDER_HOST}${path}`, {
			method,
			headers: this.requestHeaders,
			body: JSON.stringify(data)
		})

		if (!res.ok) {
			const body = await res.text()
			throw new Error(body)
		} else {
			const body = await res.json()
			if (body.error !== undefined) {
				throw new Error(body.error)
			} else {
				return body
			}
		}
	}

	async authorize({ fbToken, fbId }) {
		const res = await this.http({
			path: 'auth',
			method: 'POST',
			data: {
				facebook_token: fbToken,
				facebook_id: fbId,
				locale: 'en'
			}
		})

		this.xAuthToken = res.token
		this.userId = res.user._id
		this.defaults = res

		return res
	}

	setAuthToken({ token }) {
		this.xAuthToken = token
	}

	getAuthToken() {
		return this.xAuthToken
	}

	getDefaults() {
		return this.defaults
	}

	getRecommendations({ limit }) {
		return this.http({
			path: 'user/recs',
			method: 'GET',
			data: {
				limit
			}
		})
	}

	sendMessage({ matchId, message }) {
		return this.http({
			path: `user/matches/${matchId}`,
			method: 'POST',
			data: {
				message
			}
		})
	}

	like({ userId }) {
		return this.http({
			path: `like/${userId}`,
			method: 'GET',
			data: null
		})
	}

	superLike({ userId }) {
		return this.http({
			path: `like/${userId}/super`,
			method: 'GET',
			data: null
		})
	}

	pass({ userId }) {
		return this.http({
			path: `pass/${userId}`,
			method: 'GET',
			data: null
		})
	}

	unmatch({ matchId }) {
		return this.http({
			path: `user/matches/${matchId}`,
			method: 'DELETE',
			data: null
		})
	}

	async getUpdates() {
		const res = await this.http({
			path: 'updates',
			method: 'POST',
			data: {
				last_activity_date: this.lastActivity.toISOString()
			}
		})

		if (res !== undefined && res.last_activity_date !== undefined) {
			this.lastActivity = new Date(res.last_activity_date)
		}

		return res
	}

	getHistory() {
		return this.http({
			path: 'updates',
			method: 'POST',
			data: {
				last_activity_date: ''
			}
		})
	}

	updatePosition({ lon, lat }) {
		return this.http({
			path: 'user/ping',
			method: 'POST',
			data: {
				lon,
				lat
			}
		})
	}

	getAccount() {
		return this.http({
			path: 'meta',
			method: 'GET',
			data: null
		})
	}

	updateGender({ gender }) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				gender
			}
		})
	}

	updateBio({ bio }) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				bio
			}
		})
	}

	updateJob({ id }) {
		return this.http({
			path: 'profile/job',
			method: 'PUT',
			data: {
				company: {
					id
				}
			}
		})
	}

	deleteJob() {
		return this.http({
			path: 'profile/job',
			method: 'DELETE',
			data: null
		})
	}

	updateSchool({ id }) {
		return this.http({
			path: 'profile/school',
			method: 'PUT',
			data: {
				schools: [
					{
						id
					}
				]
			}
		})
	}

	deleteSchool() {
		return this.http({
			path: 'profiile/school',
			method: 'DELETE',
			data: null
		})
	}

	updatePreferences({ discovery, ageMin, ageMax, gender, distance }) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				discoverable: discovery,
				age_filter_min: ageMin,
				age_filter_max: ageMax,
				gender_filter: gender,
				distance_filter: distance
			}
		})
	}

	deleteAccount() {
		return this.http({
			path: 'profile',
			method: 'DELETE',
			data: null
		})
	}

	getUser({ userId }) {
		this.http({
			path: `user/${userId}`,
			method: 'GET',
			data: null
		})
	}

	async uploadPicture({ file }) {
		const url = `${TINDER_IMAGE_HOST}image?client_photo_id=ProfilePhoto${new Date().getTime()}`

		const form = new FormData()
		form.append('userId', this.userId)
		form.append('file', file)

		const res = await fetch(url, {
			method: 'POST',
			headers: this.requestImageHeaders,
			body: form
		})

		if (!res.ok) {
			const body = res.text()
			throw new Error(body)
		} else {
			return res.json()
		}
	}

	uploadFBPicture({
		pictureId,
		xdistance_percent,
		ydistance_percent,
		xoffset_percent,
		yoffset_percent
	}) {
		return this.http({
			path: 'media',
			method: 'POST',
			data: {
				transmit: 'fb',
				assets: [
					{
						ydistance_percent: ydistance_percent,
						id: pictureId,
						xoffset_percent: xoffset_percent,
						yoffset_percent: yoffset_percent,
						xdistance_percent: xdistance_percent
					}
				]
			}
		})
	}

	deletePicture({ pictureId }) {
		return this.http({
			path: 'media',
			method: 'DELETE',
			data: {
				assets: [pictureId]
			}
		})
	}

	getShareLink({ userId }) {
		return this.http({
			path: `/user${userId}/share`,
			method: 'POST',
			data: null
		})
	}

	report({ userId, causeId, causeText }) {
		const data = {
			cause: causeId
		}

		if (causeId === 0 && causeText !== null) {
			data.text = causeText
		}

		return this.http({
			path: `report/${userId}`,
			method: 'POST',
			data
		})
	}

	createUsername({ username }) {
		return this.http({
			path: 'profile/username',
			method: 'POST',
			data: {
				username
			}
		})
	}

	changeUsername({ username }) {
		return this.http({
			path: 'profile/username',
			method: 'PUT',
			data: {
				username
			}
		})
	}

	deleteUsername() {
		return this.http({
			path: 'profile/username',
			method: 'DELETE',
			data: null
		})
	}

	///////////// TINDER PLUS /////////////////

	updatePassport({ lat, lon }) {
		return this.http({
			path: '/passport/user/travel',
			method: 'POST',
			data: {
				lat,
				lon
			}
		})
	}

	resetPassport() {
		return this.http({
			path: '/passport/user/reset',
			method: 'POST',
			data: null
		})
	}
}

export default TinderClient
