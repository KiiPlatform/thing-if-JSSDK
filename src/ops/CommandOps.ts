/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';

export function postNewCommand(
    au: APIAuthor,
    target: string,
    requestObject: Object,
    onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
    //TODO: implement me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    });
}

export function getCommand(
    au:APIAuthor,
    target: string,
    commandID: string,
    onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
    //TODO: implement me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    });
}

export function listCommands(
    au:APIAuthor,
    target: string,
    listOptions?: Object,
    onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
    //TODO: implement me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    });
}
