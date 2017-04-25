'use strict';

require('isomorphic-fetch');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const TINDER_HOST = 'https://api.gotinder.com/';
class TinderClient {
    constructor() {
        this.xAuthToken = null;
        this.lastActivity = new Date();
        this.userId = null;
        this.defaults = null;
    }

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

    http({ path, method, data }) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const res = yield fetch(`${TINDER_HOST}${path}`, {
                method,
                headers: _this.requestHeaders,
                body: JSON.stringify(data)
            });

            console.log({ res });

            if (!res.ok) {
                const body = yield res.text();
                throw new Error(body);
            } else {
                return res.json();
            }
        })();
    }

    authorize({ fbToken, fbId }) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const res = yield _this2.http({
                path: 'auth',
                method: 'POST',
                data: {
                    facebook_token: fbToken,
                    facebook_id: fbId,
                    locale: 'en'
                }
            });

            console.log({ res });

            _this2.xAuthToken = res.token;
            _this2.userId = res.user._id;
            _this2.defaults = res;

            return res;
        })();
    }
}

module.exports = TinderClient;
