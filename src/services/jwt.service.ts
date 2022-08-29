import { NextFunction, Request, Response } from "express";
import CustomError from "../errors/CustomError";
import { ErrorStatusCode } from "../status-codes";
import { env } from "../utils/env-wrapper";
import Logger from "../utils/Logger";
import jsonwebtoken from 'jsonwebtoken'

const logger:Logger = new Logger('JWT Service');

export class JWTService{
    
    public static authorizeJWT = (request: Request, response: Response, next: NextFunction)=>{
        const jwt = request.cookies.token;

        if(!jwt) throw new CustomError({message:"Missing authorization cookie", code: ErrorStatusCode.MISSING_JWT, status: 401})
        
        try{
            const jwtPayload = jsonwebtoken.verify(jwt, env.jwt_secret) as jsonwebtoken.JwtPayload;

            response.locals.user = { id: jwtPayload.id, username: jwtPayload.username, role: jwtPayload.role}
        }catch(error){
            if (error instanceof jsonwebtoken.JsonWebTokenError) {
                throw new CustomError({message:"Invalid authorization cookie", code: ErrorStatusCode.INVALID_JWT, status: 401})
            }
            throw error;
        }

        next();
    }
}