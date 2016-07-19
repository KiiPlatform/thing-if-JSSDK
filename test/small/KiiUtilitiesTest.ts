/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';

import * as KiiUtil from '../../src/internal/KiiUtilities'

describe("Test KiiUtilities:", function() {
    describe("test KiiUtilities#isNumber", function() {
        it("should return true, when parameter is number", function() {
            expect(KiiUtil.isNumber(3)).to.be.true;
            expect(KiiUtil.isNumber(3.5)).to.be.true;
        })
        it("should return false, when parameter is not number", function() {
            expect(KiiUtil.isNumber(new Date())).to.be.false;
            expect(KiiUtil.isNumber("string")).to.be.false;
            expect(KiiUtil.isNumber(true)).to.be.false;
            expect(KiiUtil.isNumber({})).to.be.false;
            expect(KiiUtil.isNumber(null)).to.be.false;
        })
    })

    describe("test KiiUtilities#isString", function() {
        it("should return true, when parameter is string", function() {
            expect(KiiUtil.isString("")).to.be.true;
            expect(KiiUtil.isString("a string")).to.be.true;
        })
        it("should return false, when parameter is not string", function() {
            expect(KiiUtil.isString(new Date())).to.be.false;
            expect(KiiUtil.isString(4.5)).to.be.false;
            expect(KiiUtil.isString(true)).to.be.false;
            expect(KiiUtil.isString({})).to.be.false;
        })
    })

    describe("test KiiUtilities#isBoolean", function() {
        it("should return true, when parameter is boolean", function() {
            expect(KiiUtil.isBoolean(true)).to.be.true;
            expect(KiiUtil.isBoolean(false)).to.be.true;
        })
        it("should return false, when parameter is not boolean", function() {
            expect(KiiUtil.isBoolean(new Date())).to.be.false;
            expect(KiiUtil.isBoolean("string")).to.be.false;
            expect(KiiUtil.isBoolean(5.6)).to.be.false;
            expect(KiiUtil.isBoolean({})).to.be.false;
        })
    })

    describe("test KiiUtilities#isObject", function() {
        it("should return true, when parameter is object", function() {
            expect(KiiUtil.isObject({})).to.be.true;
            expect(KiiUtil.isObject({"key": "value"})).to.be.true;
        })
        it("should return false, when parameter is not object", function() {
            expect(KiiUtil.isObject(new Date())).to.be.false;
            expect(KiiUtil.isObject("string")).to.be.false;
            expect(KiiUtil.isObject(5.6)).to.be.false;
            expect(KiiUtil.isObject(true)).to.be.false;
        })
    })
})