import 'isomorphic-fetch'


const TINDER_HOST = 'https://api.gotinder.com/';
const TINDER_IMAGE_HOST = "https://imageupload.gotinder.com/";

class TinderClient {
    xAuthToken = null;
    lastActivity = new Date();
    userId = null;
    defaults = null;

    get requestHeaders() {
        const headers = {
            'User-Agent': 'Tinder Android Version 4.5.5',
            'os_version': '23',
            'platform': 'android',
            'app-version': '854',
            'Accept-Language': 'en',
            'Content-Type': 'application/json'    
        };

        if (this.xAuthToken !== null) {
            headers['X-Auth-Token'] = this.xAuthToken;
        }

        return new Headers(headers);
    }

    async http({path, method, data}) {
        const res = await fetch(`${TINDER_HOST}${path}`, {
            method,
            headers: this.requestHeaders,
            body: JSON.stringify(data)
        });
        
        if (!res.ok) {
            const body = await res.text();
            throw new Error(body);
        } else {
            return res.json();
        }
    }

    async authorize({fbToken, fbId}) {
        const res = await this.http({
            path: 'auth',
            method: 'POST',
            data: {
                facebook_token: fbToken,
                facebook_id: fbId,
                locale: 'en'
            }
        });

        this.xAuthToken = res.token;
        this.userId = res.user._id;
        this.defaults = res;

        return res
    }

    setAuthToken(token) {
        this.xAuthToken = token;
    }

    getAuthToken() {
        return this.xAuthToken;
    }

    getDefaults() {
        return this.defaults;
    }
}

export default TinderClient