import { ErrorCodes, HttpException } from "./root";

export class notFoundException extends HttpException{
    constructor(message:string , errorCode:ErrorCodes){
        super(message , errorCode , 404 , null) 
    }
}