/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
export default class ThingOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public target: string
    ){
        super(au);
    }

    getVendorThingID(): Promise<Object> {
        //TODO: implment me
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        })
    }

    updateVendorThingID(
        newVendorThingID: string,
        newPassword: string): Promise<void> {
        //TODO: implment me
        return new Promise<void>((resolve, reject)=>{
            resolve();
        })
    }
}

