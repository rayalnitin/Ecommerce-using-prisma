import { Request , Response , NextFunction } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCodes } from "../exceptions/root";

export const adminMiddleware = async(req:Request , res:Response , next:NextFunction)=>{
    /*
        * extract the token from the header (step - 1)
        * if token is not present ,throw an error of unauthorized (step - 2)
        * if the token is present , verify the token and extract the payload (step - 3) 
        * to get the user from the payload (step - 4)
        * to attach the user to the current request object (step - 5)
    */
    const user = req.user
    if(user?.role=='ADMIN'){
        next()
    }else{
        next(new UnauthorizedException('Unauthorized Exception' , ErrorCodes.UNAUTHORIZED_EXCEPTION))
    }
   
}