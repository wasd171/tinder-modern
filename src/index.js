// @flow
import 'isomorphic-fetch'
import 'isomorphic-form-data'
import { XMLHttpRequest } from 'xmlhttprequest'

const TINDER_HOST: string = 'https://api.gotinder.com/'
const TINDER_IMAGE_HOST: string = 'https://imageupload.gotinder.com/'

type XAuthTokenType = string | null

type LastActivityType = Date

type UserIdType = string | null

type DefaultsType = any

type RequestHeadersParamsType = {
	'Accept-Language': string,
	'app-version': string,
	'Content-Type': string,
	'User-Agent': string,
	'X-Auth-Token'?: string,
	os_version: string,
	platform: string
}

type HTTPArgsType = {
	data: any | void,
	method: 'GET' | 'POST' | 'PUT' | 'DELETE',
	path: string
}

type AuthorizeArgsType = {
	fbId: string,
	fbToken: string
}

type SetAuthTokenArgsType = {
	token: string
}

type GetRecommendationsArgsType = {
	limit: number
}

type SendMessageArgsType = {
	matchId: string,
	message: string
}

type LikeArgsType = {
	userId: string
}

type SuperLikeArgsType = LikeArgsType

type PassArgsType = LikeArgsType

type UnmatchArgsType = {
	matchId: string
}

type UpdatePositionArgsType = {
	lat: number,
	lon: number
}

type UpdateGenderArgsType = {
	gender: 0 | 1
}

type UpdateBioArgsType = {
	bio: string
}

type UpdateJobArgsType = {
	id: string
}

type UpdateSchoolArgsType = {
	id: string
}

type UpdatePreferencesArgsType = {
	ageMax: number,
	ageMin: number,
	discovery: boolean,
	distance: number,
	gender: -1 | 0 | 1
}

type GetUserArgsType = {
	userId: string
}

type UploadPictureArgsType = {
	file: Blob
}

type UploadFBPictureArgsType = {
	pictureId: string,
	xdistance_percent: number,
	xoffset_percent: number,
	ydistance_percent: number,
	yoffset_percent: number
}

type DeletePictureArgsType = {
	pictureId: string
}

type GetShareLinkArgsType = {
	userId: string
}

type ReportArgsType = {
	causeId: 0 | 1 | 4,
	causeText: string,
	userId: string
}

type ReportDataType = {
	cause: 0 | 1 | 4,
	text?: string
}

type CreateUsernameArgsType = {
	username: string
}

type ChangeUsernameArgsType = CreateUsernameArgsType

type UpdatePassportArgsType = {
	lat: number,
	lon: number
}

class TinderClient {
	xAuthToken: XAuthTokenType = null
	lastActivity: LastActivityType = new Date()
	userId: UserIdType = null
	defaults: DefaultsType = null

	get requestHeaders(): Headers {
		const headers: RequestHeadersParamsType = {
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

	get requestImageHeaders(): Headers {
		const headers: Headers = this.requestHeaders
		headers.set('Content-Type', 'multipart/form-data')

		return headers
	}

	async http({ path, method, data }: HTTPArgsType) {
		const res: Response = await fetch(`${TINDER_HOST}${path}`, {
			method,
			headers: this.requestHeaders,
			body: JSON.stringify(data)
		})

		if (!res.ok) {
			const body: string = await res.text()
			throw new Error(body)
		} else {
			const body: any = await res.json()
			if (body.error !== undefined) {
				throw new Error(body.error)
			} else {
				return body
			}
		}
	}

	static async isOnline(timeout: void | number = 5000) {
		try {
			const status: number = await new Promise((resolve, reject) => {
				const xhr: XMLHttpRequest = new XMLHttpRequest()
				xhr.timeout = timeout
				xhr.addEventListener('timeout', reject)
				xhr.addEventListener('error', reject)
				xhr.addEventListener('load', () => resolve(xhr.status))
				xhr.open('GET', `${TINDER_HOST}meta`, true)
				xhr.send(null)
			})

			if (status === 401) {
				return true
			} else {
				throw new Error('Unexpected status')
			}
		} catch (err) {
			return false
		}
	}

	async authorize({ fbToken, fbId }: AuthorizeArgsType) {
		const res: any = await this.http({
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

	setAuthToken({ token }: SetAuthTokenArgsType) {
		this.xAuthToken = token
	}

	getAuthToken() {
		return this.xAuthToken
	}

	getDefaults() {
		return this.defaults
	}

	getRecommendations({ limit }: GetRecommendationsArgsType) {
		return this.http({
			path: 'user/recs',
			method: 'GET',
			data: {
				limit
			}
		})
	}

	sendMessage({ matchId, message }: SendMessageArgsType) {
		return this.http({
			path: `user/matches/${matchId}`,
			method: 'POST',
			data: {
				message
			}
		})
	}

	like({ userId }: LikeArgsType) {
		return this.http({
			path: `like/${userId}`,
			method: 'GET',
			data: null
		})
	}

	superLike({ userId }: SuperLikeArgsType) {
		return this.http({
			path: `like/${userId}/super`,
			method: 'GET',
			data: null
		})
	}

	pass({ userId }: PassArgsType) {
		return this.http({
			path: `pass/${userId}`,
			method: 'GET',
			data: null
		})
	}

	unmatch({ matchId }: UnmatchArgsType) {
		return this.http({
			path: `user/matches/${matchId}`,
			method: 'DELETE',
			data: null
		})
	}

	async getUpdates() {
		const res: any = await this.http({
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

	updatePosition({ lon, lat }: UpdatePositionArgsType) {
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

	updateGender({ gender }: UpdateGenderArgsType) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				gender
			}
		})
	}

	updateBio({ bio }: UpdateBioArgsType) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				bio
			}
		})
	}

	updateJob({ id }: UpdateJobArgsType) {
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

	updateSchool({ id }: UpdateSchoolArgsType) {
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

	updatePreferences({
		discovery,
		ageMin,
		ageMax,
		gender,
		distance
	}: UpdatePreferencesArgsType) {
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

	getUser({ userId }: GetUserArgsType) {
		return this.http({
			path: `user/${userId}`,
			method: 'GET',
			data: null
		})
	}

	async uploadPicture({ file }: UploadPictureArgsType) {
		const url: string = `${TINDER_IMAGE_HOST}image?client_photo_id=ProfilePhoto${new Date().getTime()}`

		const form: FormData = new FormData()
		if (this.userId === null) {
			throw new Error('Trying to upload picture without existing userId')
		}
		form.append('userId', this.userId)
		form.append('file', file)

		const res: Response = await fetch(url, {
			method: 'POST',
			headers: this.requestImageHeaders,
			body: form
		})

		if (!res.ok) {
			const body: string = await res.text()
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
	}: UploadFBPictureArgsType) {
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

	deletePicture({ pictureId }: DeletePictureArgsType) {
		return this.http({
			path: 'media',
			method: 'DELETE',
			data: {
				assets: [pictureId]
			}
		})
	}

	getShareLink({ userId }: GetShareLinkArgsType) {
		return this.http({
			path: `/user${userId}/share`,
			method: 'POST',
			data: null
		})
	}

	report({ userId, causeId, causeText }: ReportArgsType) {
		const data: ReportDataType = {
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

	createUsername({ username }: CreateUsernameArgsType) {
		return this.http({
			path: 'profile/username',
			method: 'POST',
			data: {
				username
			}
		})
	}

	changeUsername({ username }: ChangeUsernameArgsType) {
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

	updatePassport({ lat, lon }: UpdatePassportArgsType) {
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
