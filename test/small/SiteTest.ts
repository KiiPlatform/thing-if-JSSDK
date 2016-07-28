/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
declare var require: any
var thingIFSDK = require('../../../dist/thing-if-sdk.js');

import {expect} from 'chai';
var Site = thingIFSDK.Site;
describe('Site', () => {
    describe('#check enum', () => {
        it('value of enum should be correct', () => {
            expect(Site.US).to.equal("https://api.kii.com");
            expect(Site.JP).to.equal("https://api-jp.kii.com");
            expect(Site.CN3).to.equal("https://api-cn3.kii.com");
            expect(Site.SG).to.equal("https://api-sg.kii.com");
            expect(Site.EU).to.equal("https://api-eu.kii.com");
        });
    });
});
