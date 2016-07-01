/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
declare var require: any
var thingIFSDK = require('../dist/thing-if-sdk.js');

import {expect} from 'chai';
var Site = thingIFSDK.Site;
describe('Site', () => {
    describe('#check enum', () => {
        it('value of enum should be correct', () => {
            expect(Site.US).to.equal(0); 
            expect(Site.JP).to.equal(1); 
            expect(Site.CN3).to.equal(2); 
            expect(Site.SG).to.equal(3); 
            expect(Site.EU).to.equal(4); 
        });
    });
});
