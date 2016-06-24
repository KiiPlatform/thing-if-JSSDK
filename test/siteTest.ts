/// <reference path="../typings/globals/mocha/index.d.ts" />
/// <reference path="../typings/globals/chai/index.d.ts" />
import {Site} from '../src/Site';
import {expect} from 'chai'

describe('Site', () => {
    describe('#getBaseURL', () => {
        it('base url string should be correct', () => {
            expect(Site.getBaseUrl(Site.US)).to.equal("https://api.kii.com"); 
            expect(Site.getBaseUrl(Site.JP)).to.equal("https://api-jp.kii.com"); 
            expect(Site.getBaseUrl(Site.CN3)).to.equal("https://api-cn3.kii.com"); 
            expect(Site.getBaseUrl(Site.SG)).to.equal("https://api-sg.kii.com"); 
            expect(Site.getBaseUrl(Site.EU)).to.equal("https://api-eu.kii.com"); 
        });
    });
});
