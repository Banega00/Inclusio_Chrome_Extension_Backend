import { Httper } from "../utils/http/httper";
import Logger from "../utils/Logger"

//This is Service
//Its responsibility is to execute specific functions without knowledge of request, and response objects
export class ExampleService{

    private logger:Logger;
    private httper: Httper;
    constructor() {
        this.logger = new Logger(this.constructor.name)
        this.httper = new Httper('http://api.open-notify.org')
        // this.logger.info('Example Service initialized')
    }

    //If you want to return error response from here, just throw an error which will be handled in middleware's try/catch
    exampleMethod = (data:any) =>{
        this.logger.info(`Example method reached - ${data}`)
        return;
    }

    testHttpMiddleware = async (data:any) =>{
        const response = await this.httper.get('/astros.json')
        return response;
    }
}