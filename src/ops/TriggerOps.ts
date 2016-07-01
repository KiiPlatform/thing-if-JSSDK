/// <reference path="../../typings/modules/es6-promise/index.d.ts" />
import {Promise} from 'es6-promise';
import request from './Request';
import {App} from '../App';
import {APIAuthor} from '../APIAuthor';

export function postTrigger(
    au: APIAuthor,
    target: string,
    requestObject: Object,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function getTrigger(
    au: APIAuthor,
    target: string,
    triggerID: string,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function patchTrigger(
    au: APIAuthor,
    target: string,
    triggerID: string,
    requestObject: Object,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function enableTrigger(
    au: APIAuthor,
    target: string,
    triggerID: string,
    enable: boolean,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function deleteTrigger(
    au: APIAuthor,
    target: string,
    triggerID: string,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function listTriggers(
    au: APIAuthor,
    target: string,
    listOptions?: Object,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}

export function listServerCodeResults(
    au: APIAuthor,
    target: string,
    triggerID: string,
    listOptions?: Object,
    onCompletion?: (err: Error, res:Object)=> void): Promise<Object> {
    //TODO: implment me
    return new Promise<Object>((resolve, reject)=>{
        resolve({});
    })
}