import winston from "winston";
import httpContext from 'express-http-context'
import { Request, Response, NextFunction } from "express";

export enum BloggerColor{
    Black = "\x1b[30m",
    Red = "\x1b[31m",
    Green = "\x1b[32m",
    Yellow = "\x1b[33m",
    Blue = "\x1b[34m",
    Magenta = "\x1b[35m",
    Cyan = "\x1b[36m",
    White = "\x1b[37m"
}

export default class Blogger{
    private readonly instance: winston.Logger;

    public static colorMap = {
        debug: BloggerColor.Blue, //blue
        info: BloggerColor.Green, //green
        warn: BloggerColor.Yellow, //yellow
        error: BloggerColor.Red, //red
        verbose: BloggerColor.Magenta //magenta
    }

    public static setColors(obj:Partial<typeof Blogger.colorMap>){
        for(const level in obj){
            (Blogger.colorMap as any)[level] = (obj as any)[level];
        }
    }
    
    public constructor(moduleName?: string) {

        const transports: winston.LoggerOptions['transports'] = [];

        moduleName = moduleName ?? 'Unknown module';

        //add transport for logging in console
        transports.push(new winston.transports.Console({
            format: winston.format.combine(
                winston.format.errors({ stack: true }),
                winston.format.label({ label: moduleName }),
                winston.format.timestamp({format:"YYYY-MM-DD HH:mm:ss.SSS"}),
                winston.format.splat(),
                Blogger.myFormat,
                // addAppNameFormat(),
              )
        }))

        const loggingFileName = process.env.logging_file?.trim();

        //add transport for logging in file
        if(loggingFileName){
            transports.push(
                new winston.transports.File({filename: loggingFileName, 
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.label({ label: moduleName }),
                    winston.format.json()
                ),
                maxFiles: +(process.env.logging_max_files!) || 5 ,
                maxsize: +(process.env.logging_max_size!) || (10*1024*1024)//1MB
            })
            )
        }

        this.instance = winston.createLogger({
            transports: transports
        });

        this.instance.level = process.env.logging_level ?? 'debug';
    }

    static myFormat = winston.format.printf(({ level, message, timestamp, data, ip, reqId, label, otherMetadata, ...metadata }) => {
        // let msg:string = ((Blogger.colorMap as any)[level] ?? ''); //initialize color

        let msg = `${BloggerColor.White}`;

        msg += `${timestamp} ` 
        
        msg += `| ${BloggerColor.Cyan}${reqId ?? ''}`
        msg += `${((Blogger.colorMap as any)[level])} |${level.toUpperCase().padEnd(5)}`
        msg += `| ${BloggerColor.Yellow}${label ?? ''}${BloggerColor.White}`

        msg += ((Blogger.colorMap as any)[level]);

        if(otherMetadata){
            for(const prop in otherMetadata){
                if(prop.startsWith('primitive')){
                    msg += ` | ${otherMetadata[prop]}`
                }else{
                    msg += ` | ${prop}: ${otherMetadata[prop]}`
                }
            }
        }
    
        msg += ` | ${message} `;
        
        if (data) {
            msg += data
        }
    
    
        return msg
    });

    static randomString = (length: number) =>{
        return Math.random().toString(36).substring(2,length+2);
    }

    static addMetadata = ( obj: any ) => {
        const contextMetadata = httpContext.get('metadata') ?? {};
        
        if(typeof obj == 'object'){
            for(const prop in obj ){
                contextMetadata[prop] = obj[prop];
            }
        }else{
            contextMetadata[`primitive${obj}`] = obj
        }

        httpContext.set('metadata', contextMetadata);
    }

    static setMetadata = ( obj: any ) => {
        
        if(typeof obj == 'object'){
            httpContext.set('metadata', obj);
        }else{
            const context:any = {};
            context[`primitive${this.randomString(5)}`] = obj;

            httpContext.set('metadata', context)
        }

    }

    /*
             This method:
        -    setup HTTP CONTEXT on request and response objects
        -    Logs start of request
        -    Logs end of request, response status, and request duration
     */
    static logExpressRoute = (request: Request, response: Response, next: NextFunction) => {

        httpContext.middleware(request, response, () => {
            //setup context parameters
            const reqId = request.headers.reqid ?? Blogger.randomString(6)
            httpContext.set('ip', request.ip)
            httpContext.set('reqId', reqId);
            httpContext.set('startTime', Date.now());
            httpContext.set('route', `${request.method.toUpperCase()} ${request.originalUrl}`);

            const logger = new Blogger('Request start')

            logger.info(`${httpContext.get('route')}`)


            const oldResponseStatus = response.status.bind(response);
            //change response.status function to log end of response before sending
            response.status = (code: number) => {
                const logger = new Blogger('Request end')
                logger.info(`${Date.now() - httpContext.get('startTime')}msec | ${httpContext.get('route')} | status: ${code}`)
                return oldResponseStatus(code);
            }

            next();
        })
    }
    
    public error(message: string, data?: any): void {
        const dataToPrint = data instanceof Error ? JSON.stringify({message:data.message, stack: data.stack},null,2) : JSON.stringify(data,null,2)
        this.print(this.instance.error.bind(this.instance), message, dataToPrint);
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
    
    public verbose(message: string, data?: any): void {
        const dataToPrint = data instanceof Error ? JSON.stringify({message:data.message, stack: data.stack},null,2) : JSON.stringify(data,null,2)
        this.print(this.instance.verbose.bind(this.instance), message, dataToPrint);
    }

    private print(messageLevel: Function, message: string, data?: any): void {
        const properties:any = {
            message, 
            data, 
            ip: httpContext.get('ip'), 
            reqId: httpContext.get('reqId'), 
            microservice: '',
            otherMetadata: {}
        }

        const requestMetadata = httpContext.get('metadata');
        for(const prop in requestMetadata){
            properties.otherMetadata[prop] = requestMetadata[prop];
        }

        messageLevel(properties);
    }
}