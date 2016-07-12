/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/modules/nock/index.d.ts" />
import {expect} from 'chai';
import {Response} from '../src/ops/Response'
import {default as request} from '../src/ops/Request'
import * as nock from 'nock'
let scope : nock.Scope;

describe('Get Request', function () {
    let hostname = "http://api-jp.test.com";
    let path = "/thing-if/apps/abcdefg/onboardings";
    let reqHeaders = {
        "X-Kii-AppID": "abcdefg",
        "X-Kii-AppKey": "1234567890abcdefg"
    }
    let requestOptions = {
        method: "GET",
        headers: {
            "X-Kii-AppID": "abcdefg",
            "X-Kii-AppKey": "1234567890abcdefg"
        },
        url: `${hostname}${path}`
    };

    beforeEach(function() {
        nock.cleanAll();
    });

    it("handle success response", function (done) {
        scope = nock(
            hostname,
            <any>{
                reqheaders: reqHeaders
            }).get(path)
            .reply(200, {id: 1, name: "abcd"});

        request(requestOptions).then((res:Response)=>{
            expect(res.status).to.equal(200);
            done();
        }).catch((err:Error)=>{
            done(err);
        });
    });

    it("handle error response", function (done) {
        let errResponse = {
            "errorCode": "INVALID_INPUT_DATA",
            "message": "There are validation errors: thingID - Invalid thing. ",
            "invalidFields": {
                "thingID": "Invalid thing"
            }
        };
        scope = nock(hostname).
            get(path).
            reply(400, errResponse);
        request(requestOptions).then((res:Response) => {
            done("should fail");
        }).catch((err:Error)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(400);
            expect(err.message).to.equal(JSON.stringify(errResponse));
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});