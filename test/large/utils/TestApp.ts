// / <reference path="../../../typings/globals/node/index.d.ts" />
/// <reference path="../../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';

import {Site} from '../../../src/Site'
declare var process: any
let envApp = (process.env.TestApp || "").split(":");

describe('TestApp Configuration', () => {
    describe('#check env string', () => {
        it('should be configured', () => {
            expect(envApp.length).to.equal(4);
        });
    });
});

export const APPID = envApp[0];
export const APPKEY = envApp[1];
export const SITE = envApp[2];
export const OWNERID = "34cc40051321-6169-4e11-017b-02367441";
export const TOKEN = envApp[3];
export const BASEURL = Site[SITE];
