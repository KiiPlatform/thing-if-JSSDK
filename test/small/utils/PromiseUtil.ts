/// <reference path="../../../typings/modules/es6-promise/index.d.ts" />
import {Promise as P} from 'es6-promise';

/** Loop with promise. When error happended inside action, loop will be stoped
 * @example  <caption>Typescript Example</caption>
 *
    let i=0, count=10;
    promiseWhile(()=>{ // condition block
        return i<count;
    }, ()=>{ // action block
        return new P<void>((resolve, reject)=>{
            if(/should succeeded this time/){
                i++;
                resolve();
            }else{ // end the loop
                reject();
            }
        });
    }).then(()=>{
        // loop end and succeeded
    }).catch((err)=>{
        // loop end but faild
    })
 */
export function promiseWhile(condition: ()=>void, action: ()=>P<void>): P<void>{
    return new P<void>((resolve, reject)=>{
        let whileLoop = ()=>{
            if(!condition()){
                resolve();
            }else{
                action().then(()=>{
                    whileLoop();
                }).catch((err)=>{
                    reject(err);
                })
            }
        }
        whileLoop();
    });
}

