/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';

export function getVendorThingID(
    au: APIAuthor,
    target: string,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function updateVendorThingID(
    au: APIAuthor,
    target: string,
    newVendorThingID: string,
    newPassword: string,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

