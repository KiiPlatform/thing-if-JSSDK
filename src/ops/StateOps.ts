/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import APIAuthor from '../APIAuthor';

export function getState(
    au: APIAuthor,
    target: string,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}