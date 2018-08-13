/// <reference path="../../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../../node_modules/@types/chai/index.d.ts" />
import { expect } from 'chai';
import { aggregationToJson } from '../../../src/internal/JsonUtilities';
import { Aggregation, FunctionType, FieldType } from '../../../src/Aggregation';
describe("Test JsonUtilities#aggregationToJson()", () => {
    it("provide with aggregation instane, expected json should be returned", () => {
        expect(aggregationToJson(new Aggregation(
            FunctionType.COUNT,
            "field1",
            FieldType.ARRAY))).deep.equal({
                type: "COUNT",
                field: "field1",
                fieldType: "ARRAY",
                putAggregationInto: "count"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.COUNT,
            "field1",
            FieldType.BOOLEAN))).deep.equal({
                type: "COUNT",
                field: "field1",
                fieldType: "BOOLEAN",
                putAggregationInto: "count"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.COUNT,
            "field1",
            FieldType.DECIMAL))).deep.equal({
                type: "COUNT",
                field: "field1",
                fieldType: "DECIMAL",
                putAggregationInto: "count"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.COUNT,
            "field1",
            FieldType.INTEGER))).deep.equal({
                type: "COUNT",
                field: "field1",
                fieldType: "INTEGER",
                putAggregationInto: "count"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.COUNT,
            "field1",
            FieldType.OBJECT))).deep.equal({
                type: "COUNT",
                field: "field1",
                fieldType: "OBJECT",
                putAggregationInto: "count"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.MAX,
            "field1",
            FieldType.INTEGER))).deep.equal({
                type: "MAX",
                field: "field1",
                fieldType: "INTEGER",
                putAggregationInto: "max"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.MAX,
            "field1",
            FieldType.DECIMAL))).deep.equal({
                type: "MAX",
                field: "field1",
                fieldType: "DECIMAL",
                putAggregationInto: "max"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.MEAN,
            "field1",
            FieldType.INTEGER))).deep.equal({
                type: "MEAN",
                field: "field1",
                fieldType: "INTEGER",
                putAggregationInto: "mean"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.MEAN,
            "field1",
            FieldType.DECIMAL))).deep.equal({
                type: "MEAN",
                field: "field1",
                fieldType: "DECIMAL",
                putAggregationInto: "mean"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.MIN,
            "field1",
            FieldType.INTEGER))).deep.equal({
                type: "MIN",
                field: "field1",
                fieldType: "INTEGER",
                putAggregationInto: "min"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.MIN,
            "field1",
            FieldType.DECIMAL))).deep.equal({
                type: "MIN",
                field: "field1",
                fieldType: "DECIMAL",
                putAggregationInto: "min"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.SUM,
            "field1",
            FieldType.INTEGER))).deep.equal({
                type: "SUM",
                field: "field1",
                fieldType: "INTEGER",
                putAggregationInto: "sum"
            })
        expect(aggregationToJson(new Aggregation(
            FunctionType.SUM,
            "field1",
            FieldType.DECIMAL))).deep.equal({
                type: "SUM",
                field: "field1",
                fieldType: "DECIMAL",
                putAggregationInto: "sum"
            })
    })
})