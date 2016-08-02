/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/nock/index.d.ts" />
import {expect} from 'chai';
import {Response} from '../../src/ops/Response'
import {ThingIFError, HttpRequestError} from '../../src/ThingIFError'
import {default as request} from '../../src/ops/Request'
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
            .reply(200, {id: 1, name: "abcd"}, {"Content-Type": "application/json"});

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
            reply(400, errResponse, {"Content-Type": "application/json"});
        request(requestOptions).then((res:Response) => {
            done("should fail");
        }).catch((err:ThingIFError)=>{
            expect(err).not.be.null;
            expect((<any>err)["status"]).to.equal(400);
            expect((<HttpRequestError>err).message).to.equal(errResponse.message);
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });

    it("handle html response", function (done) {
        let resBody = "<htm><body>server error</body></html>";
        scope = nock(hostname).
            get(path).
            reply(500, resBody, {"Content-Type": "text/html"});
        request(requestOptions).then((res:Response) => {
            done("should fail");
        }).catch((err:HttpRequestError)=>{
            expect(err).not.be.null;
            expect(err.status).to.equal(500);
            expect(err.message).to.equal("");
            expect(err.body.rawData).to.equal(resBody);
            expect(err.body.errorCode).to.null;
            expect(err.body.message).to.null;
            done();
        }).catch((err: Error)=>{
            done(err);
        });
    });
});