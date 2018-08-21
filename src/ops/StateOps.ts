
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';
import BaseOp from './BaseOp'
import {TypedID} from '../TypedID'
import { isString } from '../internal/KiiUtilities';

export default class StateOps extends BaseOp {
    private baseUrl: string
    constructor(
        public au: APIAuthor,
        public targetID: TypedID
    ){
        super(au);
        this.baseUrl = `${this.au.app.getThingIFBaseUrl()}/targets/${this.targetID.toString()}/states`;
    }

    getState(alias?: string): Promise<Object> {
        return new Promise<Object>((resolve, reject)=>{
            let url = this.baseUrl;
            if(!!alias) {
                url += `/aliases/${alias}`
            }
            var req = {
                method: "GET",
                headers: this.getHeaders(),
                url: url
            };
            request(req).then((res)=>{
                resolve(res.body);
            }).catch((err)=>{
                reject(err);
            });
        })
    }
}