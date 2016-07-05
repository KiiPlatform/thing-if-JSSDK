/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';

export function installFCM(
    au: APIAuthor,
    installationRegistrationID: string,
    development: boolean,
    onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
    //TODO: implement me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    });
}

export function installMqtt(
    au:APIAuthor,
    development: boolean,
    onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
    //TODO: implement me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    });
}

export function uninstall(
    au: APIAuthor,
    installationID: string,
    onCompletion?: (err:Error, res:Object)=>void): Promise<Object> {
    //TODO: implement me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    });
}