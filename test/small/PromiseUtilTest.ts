/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {Promise as P} from 'es6-promise';
import {expect} from 'chai';
declare var process: any
import {promiseWhile} from './utils/PromiseUtil'

describe("Test promiseWhile", function () {
    it("10 loop, all succeeded", function(done) {
        let i=0, count=10;
        promiseWhile(()=>{
            return i<count;
        }, ()=>{
            return new P<void>((resolve, reject)=>{
                process.nextTick(()=>{
                    i++;
                    resolve();
                });
            });
        }).then(()=>{
            expect(i).to.equal(10);
            done();
        }).catch((err)=>{
            done(err);
        })
    })
})

describe("Test promiseWhile", function () {
    it("10 loop, one failed", function(done) {
        var i=0, count=10;
        let expectedError = new Error("expected error");
        promiseWhile(()=>{
            return i<count;
        }, ()=>{
            return new P<void>((resolve, reject)=>{
                if (i==5){
                    throw expectedError;
                }else{
                    i++;
                    resolve();
                }
            });
        }).then(()=>{
            done("should fail");
        }).catch((err)=>{
            expect(i).to.equal(5);
            expect(err).to.equal(expectedError);
            done();
        }).catch((err)=>{
            done(err);
        })
    })
})
