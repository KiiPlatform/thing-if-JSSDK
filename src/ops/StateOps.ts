/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
export default class StateOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public target: string
    ){
        super(au);
    }

    getState(): Promise<Object> {
        //TODO: implment me
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        })
    }
}