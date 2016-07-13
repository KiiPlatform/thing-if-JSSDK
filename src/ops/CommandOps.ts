/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
export default class CommandOps extends BaseOp {
    constructor(
        public au: APIAuthor,
        public target: string
    ){
        super(au);
    }

    postNewCommand(
        requestObject: Object,
        onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
        //TODO: implement me
        this.addHeaders({});// add necessary headers
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        });
    }

    listCommands(
        listOptions?: Object,
        onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
        //TODO: implement me
        this.addHeaders({});// add necessary headers
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        });
    }


    getCommand(
        commandID: string,
        onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
        //TODO: implement me
        this.addHeaders({});// add necessary headers
        return new Promise<Object>((resolve, reject)=>{
            resolve({});
        });
    }
}