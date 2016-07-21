/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';
import * as TestUtil from './utils/TestUtil'

describe("test TestUtil#sameDate", function() {
    it("if difference of 2 dates less than 10 milliseconds, they should be same", function() {
        var date1 = new Date();
        var date2 = new Date(date1.getTime()+1);
        var date3 = new Date(date1.getTime()+9);
        var date4 = new Date(date1.getTime()-1);
        var date5 = new Date(date1.getTime()-9);
        expect(TestUtil.sameDate(date1, date1)).to.true;
        expect(TestUtil.sameDate(date1, date2)).to.true;
        expect(TestUtil.sameDate(date1, date3)).to.true;
        expect(TestUtil.sameDate(date1, date4)).to.true;
        expect(TestUtil.sameDate(date1, date5)).to.true;
    })
    it("if difference of 2 dates more than 10 milliseconds, they should not be same", function() {
        var date1 = new Date();
        var date2 = new Date(date1.getTime()+11);
        var date3 = new Date(date1.getTime()+19);
        var date4 = new Date(date1.getTime()-11);
        var date5 = new Date(date1.getTime()-19);
        expect(TestUtil.sameDate(date1, date2)).to.false;
        expect(TestUtil.sameDate(date1, date3)).to.false;
        expect(TestUtil.sameDate(date1, date4)).to.false;
        expect(TestUtil.sameDate(date1, date5)).to.false;
    })
})