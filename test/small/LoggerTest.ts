/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />

import { Logger, LogLevel } from '../../src/Logger';
import { expect } from 'chai';
import * as simple from 'simple-mock';
declare var require: any
let winston: any = require('winston');


class MockWinstonLogger {
    public args: any[];

    public log (...args: any[]){
        this.args = args;
    }
}
describe(`Test Logger`, ()=>{
    describe(`test getInstance()`, ()=>{
        it(`logger should be singleton`, (done)=> {
            Logger.getInstance().setLogLevel(LogLevel.Error);
            expect(Logger.getInstance().getLogLevel()).to.equals("error");
            Logger.getInstance().setLogLevel(LogLevel.Debug);
            expect(Logger.getInstance().getLogLevel()).to.equals("debug");
            Logger.getInstance().setLogLevel(LogLevel.Info);
            expect(Logger.getInstance().getLogLevel()).to.equals("info");
            Logger.getInstance().setLogLevel(LogLevel.Silly);
            expect(Logger.getInstance().getLogLevel()).to.equals("silly");
            Logger.getInstance().setLogLevel(LogLevel.Verbose);
            expect(Logger.getInstance().getLogLevel()).to.equals("verbose");
            Logger.getInstance().setLogLevel(LogLevel.Warn);
            expect(Logger.getInstance().getLogLevel()).to.equals("warn");
            done();
        })
    });

    describe(`test log()`, ()=> {

        afterEach(()=>{
            simple.restore();
        })
        it(`should call winston.Logger.log()`, ()=> {
            let logger = Logger.getInstance();
            let mockLogger = new MockWinstonLogger();
            simple.mock(logger, "winstonLogger", mockLogger);

            // log only with level and single message
            logger.log(LogLevel.Debug, "debug msg");
            expect(mockLogger.args.length).to.equals(2);
            expect(mockLogger.args[0]).to.equals("debug");
            expect(mockLogger.args[1]).to.equals("debug msg");

            // log with level and msg with placeholder token
            logger.log(LogLevel.Info, "debug msg: %s", "a string");
            expect(mockLogger.args.length).to.equals(3);
            expect(mockLogger.args[0]).to.equals("info");
            expect(mockLogger.args[1]).to.equals("debug msg: %s");
            expect(mockLogger.args[2]).to.equals("a string");

            // log with level, placeholder message, and data
            logger.log(LogLevel.Info, 'test message %j', {number: 123}, {});
            expect(mockLogger.args.length).to.equals(4);
            expect(mockLogger.args[0]).to.equals("info");
            expect(mockLogger.args[1]).to.equals("test message %j");
            expect(JSON.stringify(mockLogger.args[2])).to.equals(JSON.stringify({number: 123}));
            expect(JSON.stringify(mockLogger.args[3])).to.equals(JSON.stringify({}));
        })
    })
})