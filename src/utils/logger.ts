// Create a simple logger class which takes 1 constructor parameter, debug, which is a boolean. If debug is true, the logger should log the message to the console. If debug is false, the logger should not log the message to the console.
// The default value should be false

export class Logger {
    debug: boolean;

    constructor(debug = false) {
        this.debug = debug;
    }

    log(message: string, ...args: any[]) {
        if (this.debug) {
            console.log(message, ...args);
        }
    }
}