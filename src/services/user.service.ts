import CustomError from "../errors/CustomError";
import { UserEntity } from "../models/entities/User.entity";
import { UserRole } from "../models/UserRole.enum";
import { UserRepository } from "../repository/user.repository";
import { ErrorStatusCode, SuccessStatusCode } from "../status-codes";
import { hash } from "../utils/helpers";
import { Httper } from "../utils/http/httper";
import Logger from "../utils/Logger"
import { sendResponse } from "../utils/response-wrapper";

//This is Service
//Its responsibility is to execute specific functions without knowledge of request, and response objects
export class UserService{

    private logger:Logger;
    private httper: Httper;
    private userRepository: UserRepository;
    constructor() {
        this.logger = new Logger(this.constructor.name)
        this.httper = new Httper('http://api.open-notify.org')

        this.userRepository = new UserRepository();
        // this.logger.info('Example Service initialized')
    }

    registerUser = async (username: string, password: string, role: UserRole) => {

        const user = await this.userRepository.findOne({username})

        if(user) throw new CustomError({message: `User with username ${username} already exists`, status: 400, code: ErrorStatusCode.USER_ALREADY_EXISTS});

        const hashedPassword = hash(password);

        const newUser = new UserEntity({username, password: hashedPassword, role})

        await this.userRepository.add(newUser);

        this.logger.info('New user successfully registered', {id: newUser.id, username: newUser.username, role: newUser.role})

    }

    loginUser = async (username: string, password: string) => {

        const user = await this.userRepository.findOne({username})

        if(!user) throw new CustomError({message:`User ${username} does not exists`, status: 400, code: ErrorStatusCode.USER_NOT_FOUND})
    
        const hashedPassword = hash(password);

        if(user.password === hashedPassword) return true;
        else{
            throw new CustomError({message:'Invalid password', status: 400, code: ErrorStatusCode.INVALID_PASSWORD})
        }
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