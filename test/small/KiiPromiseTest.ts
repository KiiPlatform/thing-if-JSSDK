/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise';
import {promise, voidPromise} from '../../src/internal/KiiPromise'
import {expect} from 'chai';
declare var require: any
declare var process: any

class TestClass {

    promiseSucceeded(onCompletion?: (err:Error, res: string)=>void): P<string>{
        let orgPromise = new P<string>((resolve, reject)=>{
            resolve("succeeded");
        });
        return promise(orgPromise, onCompletion);
    }

    promiseFailed(onCompletion?: (err:Error, res: string)=>void): P<string>{
        let orgPromise = new P<string>((resolve, reject)=>{
            reject(new Error("failed"));
        });
        return promise(orgPromise, onCompletion);
    }

    voidPromiseSucceeded(onCompletion?: (err:Error)=>void): P<void>{
        let orgPromise = new P<void>((resolve, reject)=>{
            resolve();
        });
        return voidPromise(orgPromise, onCompletion);
    }

    voidPromiseFailed(onCompletion?: (err:Error)=>void): P<void>{
        let orgPromise = new P<void>((resolve, reject)=>{
            reject(new Error("failed"));
        });
        return voidPromise(orgPromise, onCompletion);
    }
}

describe("Test KiiPromise.promise:", function () {

    it("callbacks and promise, succeeded", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.promiseSucceeded((err, res)=>{
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

    it("only callbacks, succeeded", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.promiseSucceeded((err, res)=>{
            callbackCalled = true;
            expect(res).to.be.a('string');
            expect(err).to.null;
            done();
        })
    })

    it("only promise, succeeded", function (done) {
        let testObject = new TestClass();
        testObject.promiseSucceeded().then((res)=>{
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
            testObject.promiseSucceeded((err, res)=>{
                process.nextTick(()=>{
                    throw new Error();
                })
            }).catch((err)=>{
                done("should not catched here");
            })
        });
    })

    it("callbacks and promise, failed", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.promiseFailed((err, res)=>{
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

    it("only callbacks, failed", function (done) {
        let testObject = new TestClass();
        testObject.promiseFailed((err, res)=>{
            expect(err).to.be.a('error');
            expect(res).to.null;
            done();
        })
    })

    it("only promise, failed", function (done) {
        let testObject = new TestClass();
        testObject.promiseFailed().then((res)=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).to.be.a('error');
            done();
        }).catch((err)=>{
            done(err);
        })
    })
})

describe("Test KiiPromise.voiPromise:", function () {

    it("callbacks and promise, succeeded", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.voidPromiseSucceeded((err)=>{
            callbackCalled = true;
            expect(err).to.null;
        }).then(()=>{
            expect(callbackCalled).to.be.true;
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("only callbacks, succeeded", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.voidPromiseSucceeded((err)=>{
            callbackCalled = true;
            expect(err).to.null;
            done();
        })
    })

    it("only promise, succeeded", function (done) {
        let testObject = new TestClass();
        testObject.voidPromiseSucceeded().then(()=>{
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
            testObject.voidPromiseSucceeded((err)=>{
                process.nextTick(()=>{
                    throw new Error();
                })
            }).catch((err)=>{
                done("should not catched here");
            })
        });
    })

    it("callbacks and promise, failed", function (done) {
        let testObject = new TestClass();
        let callbackCalled = false;
        testObject.voidPromiseFailed((err)=>{
            callbackCalled = true;
            expect(err).to.be.a('error');
        }).then(()=>{
            done("should fail");
        }).catch((err)=>{
            expect(callbackCalled).to.be.true;
            expect(err).to.be.a('error');
            done();
        }).catch((err)=>{
            done(err);
        })
    })

    it("only callbacks, failed", function (done) {
        let testObject = new TestClass();
        testObject.voidPromiseFailed((err)=>{
            expect(err).to.be.a('error');
            done();
        })
    })

    it("only promise, failed", function (done) {
        let testObject = new TestClass();
        testObject.voidPromiseFailed().then(()=>{
            done("should fail");
        }).catch((err)=>{
            expect(err).to.be.a('error');
            done();
        }).catch((err)=>{
            done(err);
        })
    })
})