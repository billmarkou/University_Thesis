import fetch from "isomorphic-unfetch";
import Cookies from 'js-cookie';
import config from "../config"

function toFormData(data) {
    if (!data) return null;

    let FormDataAbstract = null
    if (process.browser) {
        FormDataAbstract = FormData
    } else {
        FormDataAbstract = require("form-data")
    }

    let fd = new FormDataAbstract()

    if (data instanceof FormDataAbstract) return data

    for (let key of Object.keys(data)) {
        fd.append(key, data[key]);
    }
    return fd;
}


function toUrlQuery(obj) {
    var str = [];
    for (var p in obj)
        if (obj.hasOwnProperty(p)) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }
    return str.join("&");
}

export default class Request {
    constructor(expressRequest) {
        if (!process.browser) {
            this._expressRequest = expressRequest;
            this._cookies = expressRequest.cookies;  
        } else {
            this._cookies = Cookies.get()
        }
    }

    getOptions(method, data, inUrl) {
        if (!data) {
            data = {};
        }

        //Creating the fetch options
        let options = {
            method: method ,
            body:
                method != "GET"
                    ? toFormData(data)
                    : null
        };


        //Configure url query
        let url;
        if (method == "GET") {
            url = `${inUrl}?${toUrlQuery(data)}`;
        } else {
            url = inUrl;
        }


        const headers = {
            "Access-Control-Request-Headers": "Session-Id, Authorization"
        };
        if (this._cookies) {
            let tokken = this._cookies.authToken
            let session_id = this._cookies.session_id
    
       
            if (tokken) { 
                headers.Authorization = `Token ${tokken}`  
            }
            if (session_id) { 
                headers['Session-Id'] = session_id;
            }
        }
        options.headers = headers
        
        return { options, url };
    }



    fetch(method, relativeUrl, data) {
        return new Promise(async (resolve, reject) => {
            this.fetchNoProcessing(method, relativeUrl, data)
                .catch(err => {
                    reject(err);
                })
                .then(async res => {
                    if (!res) {
                        reject("Could not connect");
                    } else if (res.error) {
                        reject(res.error);
                    } else if (res.status != 200) {
                        let text = await res.text();
                        try {
                            let json;

                            json = JSON.parse(text);

                            reject(json);
                        } catch (ex) {
                            reject(text);
                        }

                    } else {
                        let text = await res.text();
                        try {
                            let json;

                            json = JSON.parse(text);

                            resolve(json);
                        } catch (ex) {
                            resolve(text);
                        }
                    }
                });
        });
    }

    fetchNoProcessing(method, relativeUrl, data) {
        return new Promise(async (resolve, reject) => {
            let { options, url } = this.getOptions(method, data, relativeUrl);

            let apiPath = process.browser ? config.apiPath : config.apiPathServerSide

            fetch(apiPath + url, options)
                .catch(err => {
                    reject(err);
                })
                .then(res => {
                    resolve(res);
                });
        });
    }

    fetchRaw(method, rawUrl, data) {
        return new Promise(async (resolve, reject) => {
            let { options, url } = this.getOptions(method, data, rawUrl);

            fetch(url, options)
                .catch(err => {
                    reject(err);
                })
                .then(res => {
                    resolve(res);
                });
        });
    }
}