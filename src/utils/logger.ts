// Create a simple logger class which takes 1 constructor parameter, debug, which is a boolean. If debug is true, the logger should log the message to the console. If debug is false, the logger should not log the message to the console.
// The default value should be false

export class Logger {
    private static instance: Logger;
    debug: boolean;

    private constructor(debug = false) {
        this.debug = debug;
    }

    static getInstance(debug = false): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger(debug);
        }
        return Logger.instance;
    }

    log(message: string, ...args: any[]) {
        if (this.debug) {
            console.log(message, ...args);
        }
    }
}