/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise';
import {promise, voidPromise} from '../../src/internal/KiiPromise'
import {expect} from 'chai';
declare var require: any
declare var process: any

class TestClass {

    callbackSucceeded(onCompletion?: (err:Error, res: string)=>void): P<string>{
        let orgPromise = new P<string>((resolve, reject)=>{
            resolve("succeeded");
        });
        return promise(orgPromise, onCompletion);
    }

    callbackFailed(onCompletion?: (err:Error, res: string)=>void): P<string>{
        let orgPromise = new P<string>((resolve, reject)=>{
            reject(new Error("failed"));
        });
        return promise(orgPromise, onCompletion);
    }
}

describe("Test KiiPromise:", function () {

    it("callbacks, succeeded", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.callbackSucceeded((err, res)=>{
            callbackCalled = true;
            expect(res).to.be.a('string');
            expect(err).to.null;
        }).then((res)=>{
            expect(callbackCalled).to.be.true;
            expect(res).to.be.a('string');
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("callbacks(throw error), succeeded", function (done) {

        const domain = require('domain');
        const testObject = new TestClass();

        const d = domain.create();
        d.on('error', (er) => {
            done();
        });
        d.run(() => {
            testObject.callbackSucceeded((err, res)=>{
                process.nextTick(()=>{
                    throw new Error();
                })
            }).catch((err)=>{
                done("should not catched here");
            })
        });
    })

    it("callbacks, failed", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.callbackFailed((err, res)=>{
            callbackCalled = true;
            expect(err).to.be.a('error');
            expect(res).to.null;
        }).then((res)=>{
            expect(res).to.null;
            done("should fail");
        }).catch((err)=>{
            expect(callbackCalled).to.be.true;
            expect(err).to.be.a('error');
            done();
        }).catch((err)=>{
            done(err);
        })
    })
})