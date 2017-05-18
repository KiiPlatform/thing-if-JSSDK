let winston: any = require('winston');

/**
 * Represents log level.
  <ul>
  <li>LogLevel.Error: error level.</li>
  <li>LogLevel.Warn: warn level. </li>
  <li>LogLevel.Info: info level.</li>
  <li>LogLevel.Verbose: verbose level.</li>
  <li>LogLevel.Debug: debug level.</li>
  <li>LogLevel.Silly: silly level.</li>
  </ul>
 */
export const LogLevel = {
    Error: "error",
    Warn: "warn",
    Info: "info",
    Verbose: "verbose",
    Debug: "debug",
    Silly: "silly"
}

/**
 * Represents Logger for SDK.
 */
export class Logger {
    private static instance: Logger;
    private winstonLogger: any;

    private constructor() {
        this.winstonLogger = new winston.Logger({
            level: "error",
            transports: [
                new (winston.transports.Console)()
            ]
        })
    }

    /**
     * Get a singleton Logger instance.
     * @return {Logger} returns singleton instance of Logger.
     * @example
     * // should set log level first
     * ThingIF.Logger.getInstance().setLogLevel(ThingIF.LogLevel.Debug);
     */
    static getInstance(): Logger {
        if(!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Set level of logger.
     * @param {string} level level should be one of values of const {@link LogLevel}.
     */
    setLogLevel(level: string) {
        this.winstonLogger.level = level;
    }

    /**
     * Get level of logger.
     * @return level of logger.
     */
    getLogLevel(): string {
        return this.winstonLogger.level;
    }

    /**
     * Make a log record. log methods provides the same string
     * [interpolation methods]{@link https://github.com/winstonjs/winston#string-interpolation}
     * of winston.Logger.log().
     * @param {string} level level should be one of values of const {@link LogLevel}.
     * @param {string} msg log message.
     */
    log(level: string, msg: string, ...others: any[]) {
        this.winstonLogger.log.apply(this.winstonLogger, arguments);
    }

    /**
     * Internal usage only. SDK uses it to log http request.
     * @param {string} level log level for this request. Should be one of values of const {@link LogLevel}.
     * @param {any} req request object.
     */
    logHttpRequest(level: string, req: any) {
        let curl = "";
        if(!!req.method) {
            curl += `curl -X ${req.method} `
        }
        let headers = "";
        if(!!req.headers) {
            for(let key in req.headers) {
                if(req.headers.hasOwnProperty(key)) {
                    headers += `-H "${key}: ${req.headers[key]}" `;
                }
            }
        }
        curl += headers;

        if(!!req.body) {
            curl += `-d '${JSON.stringify(req.body)}' `
        }
        if(!!req.url) {
            curl += `"${req.url}"`
        }
        this.log(level, curl);
    }
}