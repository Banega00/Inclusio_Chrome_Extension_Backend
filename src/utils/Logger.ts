import winston from "winston";
import httpContext from 'express-http-context'
import { env } from "./env-wrapper";

const myFormat = winston.format.printf(({ level, message, timestamp, data, ip, reqId, ...metadata }) => {
    let msg = `${timestamp} | ${reqId ?? ''} | ${level} | ${metadata.label ?? ''} | ${message} `
    
    if (data) {
        msg += '\n'+data
    }

    return msg
});
// const addAppNameFormat = winston.format(info => {
//     info.data = "My Program";
//     return info;
//   });


//this class is wrapper around winston logger
export default class Logger{
    private readonly instance: winston.Logger;
    
    public constructor(modulaName?: string) {
        this.instance = winston.createLogger({
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.errors({ stack: true }),
                        winston.format.label({ label: modulaName }),
                        winston.format.colorize(),
                        // addAppNameFormat(),
                        winston.format.splat(),
                        winston.format.timestamp({format:"YYYY-MM-DD HH:mm:ss.SSS"}),
                        myFormat
                      )
                }),
                //Winston format for logging into the log FILE
                // new winston.transports.File({filename:'logs.log', 
                // format: winston.format.combine(
                //     winston.format.timestamp(),
                //     winston.format.label({ label: modulaName }),
                //     winston.format.json()
                // )})
            ]
        });
        this.instance.level = env.log_level ?? 'debug'
    }

    public info(message: string, data?: any): void {
        const dataToPrint = data instanceof Error ? JSON.stringify({message:data.message, stack: data.stack},null,2) : JSON.stringify(data,null,2)
        this.print(this.instance.info.bind(this.instance), message , dataToPrint);
    }

    public warn(message: string, data?: any): void {
        const dataToPrint = data instanceof Error ? JSON.stringify({message:data.message, stack: data.stack},null,2) : JSON.stringify(data,null,2)
        this.print(this.instance.warn.bind(this.instance), message, dataToPrint);
    }

    public debug(message: string, data?: any): void {
        const dataToPrint = data instanceof Error ? JSON.stringify({message:data.message, stack: data.stack},null,2) : JSON.stringify(data,null,2)
        this.print(this.instance.debug.bind(this.instance), message, dataToPrint);
    }

    public error(message: string, data?: any): void {
        const dataToPrint = data instanceof Error ? JSON.stringify({message:data.message, stack: data.stack},null,2) : JSON.stringify(data,null,2)
        this.print(this.instance.error.bind(this.instance), message, dataToPrint);
    }

    private print(messageLevel: Function, message: string, data?: any): void {
        messageLevel({message, data, ip: httpContext.get('ip'), reqId: httpContext.get('reqId'), microservice: 'SMS Node'});
    }
}