import { JWT_SECRET } from './../secrets';
import { Request , Response , NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";
import * as jwt from 'jsonwebtoken'
import { prismaClient } from '..';
import { User } from '@prisma/client';


export const authMiddleware = async(req:Request , res:Response , next:NextFunction)=>{
    /*
        * extract the token from the header (step - 1)
        * if token is not present ,throw an error of unauthorized (step - 2)
        * if the token is present , verify the token and extract the payload (step - 3) 
        * to get the user from the payload (step - 4)
        * to attach the user to the current request object (step - 5)
    */

    const token:any = req.headers.authorization
    if(!token){
        next(new UnauthorizedException('Unauthorized Exception' , ErrorCodes.UNAUTHORIZED_EXCEPTION))
    }
    try{
        const payload = jwt.verify(token , JWT_SECRET) as any
        const user  = await prismaClient.user.findFirst({where:{id:payload.userId}})

        if(!user){
            next(new UnauthorizedException('Unauthorized Exception' , ErrorCodes.UNAUTHORIZED_EXCEPTION))  
        }
        req.user = user as User
        next()  
    }catch(error){
        next(new UnauthorizedException('Unauthorized Exception' , ErrorCodes.UNAUTHORIZED_EXCEPTION))
    }
   
}