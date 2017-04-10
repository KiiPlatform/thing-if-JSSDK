import winston from 'winston'

export const LogLevel = {
    Error: "errpr",
    Warn: "warn",
    Info: "info",
    Verbose: "verbose",
    Debug: "debug",
    Silly: "silly"
}

export class Logger {
    private static instance: Logger;
    private winstonLogger: winston.Logger;

    private constructor() {
        this.winstonLogger = new winston.Logger({
            level: "error",
            transports: [
                new (winston.transports.Console)()
            ]
        })
    }

    static getInstance() {
        if(!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    setLogLevel(level: string) {
        this.winstonLogger.level = level;
    }

    log(level: string, msg: string) {
        this.winstonLogger.log(level, msg);
    }
}