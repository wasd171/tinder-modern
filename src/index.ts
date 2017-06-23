import * as FormData from 'form-data'
import fetch, { Response } from 'node-fetch'
import {
	DefaultsType,
	IAuthorizeArgs,
	IConstructorArgs,
	ICreateUsernameArgs,
	IDeletePictureArgs,
	IGetRecommendationsArgs,
	IGetShareLinkArgs,
	IGetUserArgs,
	IHTTPArgs,
	ILikeArgs,
	IReportArgs,
	IReportData,
	IRequestHeadersParams,
	ISendMessageArgs,
	ISetAuthTokenArgs,
	IUnmatchArgs,
	IUpdateBioArgs,
	IUpdateGenderArgs,
	IUpdateJobArgs,
	IUpdatePassportArgs,
	IUpdatePositionArgs,
	IUpdatePreferencesArgs,
	IUpdateSchoolArgs,
	IUploadFBPictureArgs,
	IUploadPictureArgs,
	LastActivityType,
	UserIdType,
	XAuthTokenType
} from './interfaces'

const TINDER_HOST: string = 'https://api.gotinder.com/'
const TINDER_IMAGE_HOST: string = 'https://imageupload.gotinder.com/'

class TinderClient {
	public static async isOnline(timeout: undefined | number = 5000) {
		try {
			const res: Response = await fetch(`${TINDER_HOST}meta`, {
				timeout
			})

			if (res.status === 401) {
				return true
			} else {
				throw new Error('Unexpected status')
			}
		} catch (err) {
			return false
		}
	}

	private xAuthToken: XAuthTokenType = null
	private lastActivity: LastActivityType
	private userId: UserIdType = null
	private defaults: DefaultsType = null

	constructor({ lastActivityDate }: IConstructorArgs) {
		this.lastActivity = lastActivityDate || new Date()
	}

	get requestHeaders(): IRequestHeadersParams {
		const headers: IRequestHeadersParams = {
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

		return headers
	}

	get requestImageHeaders(): IRequestHeadersParams {
		const headers: IRequestHeadersParams = this.requestHeaders
		headers['Content-Type'] = 'multipart/form-data'

		return headers
	}

	public async authorize({ fbToken, fbId }: IAuthorizeArgs) {
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

	public setAuthToken({ token }: ISetAuthTokenArgs) {
		this.xAuthToken = token
	}

	public getAuthToken() {
		return this.xAuthToken
	}

	public getDefaults() {
		return this.defaults
	}

	public getRecommendations({ limit }: IGetRecommendationsArgs) {
		return this.http({
			path: 'user/recs',
			method: 'GET',
			data: {
				limit
			}
		})
	}

	public sendMessage({ matchId, message }: ISendMessageArgs) {
		return this.http({
			path: `user/matches/${matchId}`,
			method: 'POST',
			data: {
				message
			}
		})
	}

	public like({ userId }: ILikeArgs) {
		return this.http({
			path: `like/${userId}`,
			method: 'GET',
			data: null
		})
	}

	public superLike({ userId }: ILikeArgs) {
		return this.http({
			path: `like/${userId}/super`,
			method: 'GET',
			data: null
		})
	}

	public pass({ userId }: ILikeArgs) {
		return this.http({
			path: `pass/${userId}`,
			method: 'GET',
			data: null
		})
	}

	public unmatch({ matchId }: IUnmatchArgs) {
		return this.http({
			path: `user/matches/${matchId}`,
			method: 'DELETE',
			data: null
		})
	}

	public async getUpdates() {
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

	public getHistory() {
		return this.http({
			path: 'updates',
			method: 'POST',
			data: {
				last_activity_date: ''
			}
		})
	}

	public updatePosition({ lon, lat }: IUpdatePositionArgs) {
		return this.http({
			path: 'user/ping',
			method: 'POST',
			data: {
				lon,
				lat
			}
		})
	}

	public getAccount() {
		return this.http({
			path: 'meta',
			method: 'GET',
			data: null
		})
	}

	public updateGender({ gender }: IUpdateGenderArgs) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				gender
			}
		})
	}

	public updateBio({ bio }: IUpdateBioArgs) {
		return this.http({
			path: 'profile',
			method: 'POST',
			data: {
				bio
			}
		})
	}

	public updateJob({ id }: IUpdateJobArgs) {
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

	public deleteJob() {
		return this.http({
			path: 'profile/job',
			method: 'DELETE',
			data: null
		})
	}

	public updateSchool({ id }: IUpdateSchoolArgs) {
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

	public deleteSchool() {
		return this.http({
			path: 'profiile/school',
			method: 'DELETE',
			data: null
		})
	}

	public updatePreferences({
		discovery,
		ageMin,
		ageMax,
		gender,
		distance
	}: IUpdatePreferencesArgs) {
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

	public deleteAccount() {
		return this.http({
			path: 'profile',
			method: 'DELETE',
			data: null
		})
	}

	public getUser({ userId }: IGetUserArgs) {
		return this.http({
			path: `user/${userId}`,
			method: 'GET',
			data: null
		})
	}

	public async uploadPicture({ file }: IUploadPictureArgs) {
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

	public uploadFBPicture({
		pictureId,
		xdistance_percent,
		ydistance_percent,
		xoffset_percent,
		yoffset_percent
	}: IUploadFBPictureArgs) {
		return this.http({
			path: 'media',
			method: 'POST',
			data: {
				transmit: 'fb',
				assets: [
					{
						ydistance_percent,
						id: pictureId,
						xoffset_percent,
						yoffset_percent,
						xdistance_percent
					}
				]
			}
		})
	}

	public deletePicture({ pictureId }: IDeletePictureArgs) {
		return this.http({
			path: 'media',
			method: 'DELETE',
			data: {
				assets: [pictureId]
			}
		})
	}

	public getShareLink({ userId }: IGetShareLinkArgs) {
		return this.http({
			path: `/user${userId}/share`,
			method: 'POST',
			data: null
		})
	}

	public report({ userId, causeId, causeText }: IReportArgs) {
		const data: IReportData = {
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

	public createUsername({ username }: ICreateUsernameArgs) {
		return this.http({
			path: 'profile/username',
			method: 'POST',
			data: {
				username
			}
		})
	}

	public changeUsername({ username }: ICreateUsernameArgs) {
		return this.http({
			path: 'profile/username',
			method: 'PUT',
			data: {
				username
			}
		})
	}

	public deleteUsername() {
		return this.http({
			path: 'profile/username',
			method: 'DELETE',
			data: null
		})
	}

	///////////// TINDER PLUS /////////////////

	public updatePassport({ lat, lon }: IUpdatePassportArgs) {
		return this.http({
			path: '/passport/user/travel',
			method: 'POST',
			data: {
				lat,
				lon
			}
		})
	}

	public resetPassport() {
		return this.http({
			path: '/passport/user/reset',
			method: 'POST',
			data: null
		})
	}

	private async http({ path, method, data }: IHTTPArgs) {
		const res: Response = await fetch(`${TINDER_HOST}${path}`, {
			method,
			headers: this.requestHeaders,
			body: JSON.stringify(data),
			timeout: 10000
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
}

export default TinderClient
