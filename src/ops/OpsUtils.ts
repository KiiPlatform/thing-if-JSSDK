import {APIAuthor} from '../APIAuthor';

export function newHttpHeader(au: APIAuthor): any {
    var headers: any = {
        'X-Kii-AppID': au.app.appID,
        'X-Kii-AppKey': au.app.appKey
    };
    if (au.token) {
        headers['Authorization'] = 'Bearer ' + au.token;
    }
    return headers;
}

