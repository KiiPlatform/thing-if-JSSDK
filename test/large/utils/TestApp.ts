/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import {expect} from 'chai';
import {Site} from '../../../src/Site'
import {App} from '../../../src/App'
declare var process: any

let envApp = (process.env.TestApp || "").split(":");

describe('TestApp Configuration', () => {
    describe('#check env string', () => {
        it('should be configured', () => {
            expect(envApp.length).to.equal(5);
        });
    });
});

export const APPID = envApp[0];
export const APPKEY = envApp[1];
export const SITE = envApp[2];
export const CLIENT_ID = envApp[3];
export const CLIENT_SECRET = envApp[4];

let baseUrl: string;
if( SITE.toLowerCase() == "jp" ||
    SITE.toLowerCase() == "cn3" ||
    SITE.toLowerCase() == "sg" ||
    SITE.toLowerCase() == "eu" ||
    SITE.toLowerCase() == "us"){
    baseUrl = `https://api-${SITE.toLowerCase()}.kii.com`
}else {
    baseUrl = `https://${SITE}`;
}

export const testApp = new App(APPID, APPKEY, baseUrl);

