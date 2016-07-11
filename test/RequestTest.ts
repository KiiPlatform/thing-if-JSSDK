/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
/// <reference path="../typings/modules/nock/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

declare function require(x: string): any;

import {expect} from 'chai';
import {Response} from '../src/ops/Response'
import {default as request} from '../src/ops/Request'

import * as nock from 'nock'
var scope : nock.Scope;

describe('Request', () => {
    beforeEach(function() {
        nock.cleanAll();
    });
    // afterEach(function() {
    // });
    it("sends GET request", (done) => {
        scope = nock("https://api-jp.kii.com")
            .get("/thing-if/apps/abcdefg/onboardings")
            .reply(200, {id: 1, name: "abcd"});
        request({
            method: "GET",
            headers: {
                "X-Kii-AppID": "abcdefg",
                "X-Kii-AppKey": "1234567890abcdefg"
            },
            url: 'https://api-jp.kii.com/thing-if/apps/abcdefg/onboardings',
        }).then((res:Response)=>{
            try {
                expect(res.status).to.equal(200);
                done();
            } catch (err) {
                done(err);
            }
        }).catch((err:Error)=>{
            expect(err).to.be.null;
            done();
        });
    });
});



