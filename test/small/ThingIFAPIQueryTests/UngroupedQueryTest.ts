import TestApp from '../TestApp';
import { TypedID, Types } from '../../../src/TypedID';
import { APIAuthor } from '../../../src/APIAuthor';
import { ThingIFAPI } from '../../../src/ThingIFAPI';
import * as simple from 'simple-mock';
import { QueryOps } from '../../../src/ops/QueryOps';
import {Promise as P} from 'es6-promise'
import { QueryResult } from '../../../src/QueryResult';
import { HistoryState } from '../../../src/HistoryState';
import { QueryHistoryStatesRequest } from '../../../src/RequestObjects';
import { AllClause } from '../../../src/QueryClause';
import { expect } from 'chai';
import { Errors, HttpRequestError } from '../../../src/ThingIFError';

let testApp = new TestApp();
let ownerToken = "4qxjayegngnfcq3f8sw7d9l0e9fleffd";
let owner = new TypedID(Types.User, "userid-01234");
let target = new TypedID(Types.Thing, "th.01234-abcde");
describe("Small Test ThingIFAPI#query", function() {
    let defaultRequest = new QueryHistoryStatesRequest(
        "alias1",
        new AllClause(),
        "v1",
        25,
        "200/1")

    describe("handle IllegalStateError", function() {
        let api = new ThingIFAPI(owner, ownerToken, testApp.app);
        it("when targe is null, IllegalStateError should be returned(promise)",
            function (done) {
            api.query(defaultRequest)
            .then((result)=>{
                done("should fail");
            }).catch((err)=>{
                expect(err.name).to.equal(Errors.IlllegalStateError);
                done();
            })
        })
    })

    describe("hanle success response", function(){
        let api = new ThingIFAPI(owner, ownerToken, testApp.app, target);
        let expectedResults = new QueryResult<HistoryState>(
            [
                new HistoryState({power: true}, new Date(1)),
                new HistoryState({power: false}, new Date(2))
            ],
            "200/2"
        );
        beforeEach(function() {
            simple.mock(QueryOps.prototype, 'ungroupedQuery').returnWith(
                new P<QueryResult<HistoryState>>((resolve, reject)=>{
                    resolve(expectedResults);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            api.query(defaultRequest)
            .then((results: QueryResult<HistoryState> )=>{
                expect(results.hasNext).true;
                expect(results.paginationKey).to.equal("200/2");
                expect(results.results).deep.equal([
                    new HistoryState({power: true}, new Date(1)),
                    new HistoryState({power: false}, new Date(2))
                ]);
                done();
            }).catch((err)=>{
                done(err);
            })
        })
        it("test callback", function (done) {
            api.query(defaultRequest, (err, results)=>{
                try{
                    expect(err).to.null;
                    expect(results.paginationKey).to.equal("200/2");
                    expect(results.results).deep.equal([
                        new HistoryState({power: true}, new Date(1)),
                        new HistoryState({power: false}, new Date(2))
                    ]);
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })

    describe("handle err reponse", function() {
        let api = new ThingIFAPI(owner, ownerToken, testApp.app, target);
        let expectedError = new HttpRequestError(404, Errors.HttpError, {
            "errorCode": "TARGET_NOT_FOUND",
            "message": "The target is not found"
        })

        beforeEach(function() {
            simple.mock(QueryOps.prototype, 'ungroupedQuery').returnWith(
                new P<string>((resolve, reject)=>{
                    reject(expectedError);
                })
            );
        })
        afterEach(function() {
            simple.restore();
        })
        it("test promise", function (done) {
            api.query(defaultRequest)
            .then((cmd)=>{
                done("should fail");
            }).catch((err: HttpRequestError)=>{
                expect(err).to.be.deep.equal(expectedError);
                done();
            })
        })
        it("test callback", function (done) {
            api.query(defaultRequest,(err, cmd)=>{
                try{
                    expect(err).to.be.deep.equal(expectedError);
                    expect(cmd).to.null;
                    done();
                }catch(err){
                    done(err);
                }
            })
        })
    })

})