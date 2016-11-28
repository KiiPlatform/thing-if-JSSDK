/// <reference path="../../typings/globals/mocha/index.d.ts" />
/// <reference path="../../typings/globals/chai/index.d.ts" />
import {expect} from 'chai';

import * as Clause from '../../src/Clause'

describe("Test Clause:", function() {
    describe("Equals", function() {
        it("string value", function() {
            var clause = new Clause.Equals("field1", "hoge");
            expect(clause.toJson()).to.deep.equal({type:"eq", field:"field1", value:"hoge"});
        });
        it("number value", function() {
            var clause = new Clause.Equals("field2", 1234.5);
            expect(clause.toJson()).to.deep.equal({type:"eq", field:"field2", value:1234.5});
        });
        it("boolean value", function() {
            var clause = new Clause.Equals("field3", false);
            expect(clause.toJson()).to.deep.equal({type:"eq", field:"field3", value:false});
        });
        it("alias check", function() {
            var clause = new Clause.Equals("field3", false, "dummyAlias");
            expect(clause.toJson()).to.deep.equal({type:"eq", alias:"dummyAlias", field:"field3", value:false});
        });
    });
    describe("NotEquals", function() {
        it("string value", function() {
            var clause = new Clause.NotEquals("field1", "hoge");
            expect(clause.toJson()).to.deep.equal({type:"not", clause:{type:"eq", field:"field1", value:"hoge"}});
        });
        it("number value", function() {
            var clause = new Clause.NotEquals("field2", 1234.5);
            expect(clause.toJson()).to.deep.equal({type:"not", clause:{type:"eq", field:"field2", value:1234.5}});
        });
        it("boolean value", function() {
            var clause = new Clause.NotEquals("field3", false);
            expect(clause.toJson()).to.deep.equal({type:"not", clause:{type:"eq", field:"field3", value:false}});
        });
        it("alias check", function() {
            var clause = new Clause.NotEquals("field3", false, "dummyAlias");
            expect(clause.toJson()).to.deep.equal({type:"not", clause:{type:"eq", alias:"dummyAlias", field:"field3", value:false}});
        });
    });
    describe("Range", function() {
        it("greaterThan", function() {
            var clause = Clause.Range.greaterThan("field1", 1234);
            expect(clause.toJson()).to.deep.equal({type:"range", field:"field1", lowerLimit:1234, lowerIncluded:false});
        });
        it("greaterThan alias check", function() {
            var clause = Clause.Range.greaterThan("field1", 1234, "dummyAlias");
            expect(clause.toJson()).to.deep.equal({type:"range", alias:"dummyAlias", field:"field1", lowerLimit:1234, lowerIncluded:false});
        });
        it("greaterThanEquals", function() {
            var clause = Clause.Range.greaterThanEquals("field2", 1234);
            expect(clause.toJson()).to.deep.equal({type:"range", field:"field2", lowerLimit:1234, lowerIncluded:true});
        });
        it("greaterThanEquals alias check", function() {
            var clause = Clause.Range.greaterThanEquals("field2", 1234, "dummyAlias");
            expect(clause.toJson()).to.deep.equal({type:"range", alias:"dummyAlias", field:"field2", lowerLimit:1234, lowerIncluded:true});
        });
        it("lessThan", function() {
            var clause = Clause.Range.lessThan("field3", 1234);
            expect(clause.toJson()).to.deep.equal({type:"range", field:"field3", upperLimit:1234, upperIncluded:false});
        });
        it("lessThan alias check", function() {
            var clause = Clause.Range.lessThan("field3", 1234, "dummyAlias");
            expect(clause.toJson()).to.deep.equal({type:"range", alias:"dummyAlias", field:"field3", upperLimit:1234, upperIncluded:false});
        });
        it("lessThanEquals", function() {
            var clause = Clause.Range.lessThanEquals("field4", 1234);
            expect(clause.toJson()).to.deep.equal({type:"range", field:"field4", upperLimit:1234, upperIncluded:true});
        });
        it("lessThanEquals alias check", function() {
            var clause = Clause.Range.lessThanEquals("field4", 1234, "dummyAlias");
            expect(clause.toJson()).to.deep.equal({type:"range", alias:"dummyAlias", field:"field4", upperLimit:1234, upperIncluded:true});
        });
    });
    describe("And", function() {
        it("multiple clauses", function() {
            var clause1 = new Clause.Equals("field1", "hoge");
            var clause2 = new Clause.NotEquals("field2", 1234.5);
            var clause3 = Clause.Range.lessThan("field3", 1234);
            var clause4 = Clause.Range.lessThanEquals("field4", 1234);
            var clause = new Clause.And(clause1, clause2, clause3, clause4);
            expect(clause.toJson()).to.deep.equal(
                {
                    type:"and",
                    clauses:[
                        {type:"eq", field:"field1", value:"hoge"},
                        {type:"not", clause:{type:"eq", field:"field2", value:1234.5}},
                        {type:"range", field:"field3", upperLimit:1234, upperIncluded:false},
                        {type:"range", field:"field4", upperLimit:1234, upperIncluded:true}
                    ]
                });
        });
    });
    describe("Or", function() {
        it("multiple clauses", function() {
            var clause1 = new Clause.Equals("field1", "hoge");
            var clause2 = new Clause.NotEquals("field2", 1234.5);
            var clause3 = Clause.Range.lessThan("field3", 1234);
            var clause4 = Clause.Range.lessThanEquals("field4", 1234);
            var clause = new Clause.Or(clause1, clause2, clause3, clause4);
            expect(clause.toJson()).to.deep.equal(
                {
                    type:"or",
                    clauses:[
                        {type:"eq", field:"field1", value:"hoge"},
                        {type:"not", clause:{type:"eq", field:"field2", value:1234.5}},
                        {type:"range", field:"field3", upperLimit:1234, upperIncluded:false},
                        {type:"range", field:"field4", upperLimit:1234, upperIncluded:true}
                    ]
                });
        });
    });
});
