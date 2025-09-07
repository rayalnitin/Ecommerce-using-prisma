    import { ErrorCodes, HttpException } from "./root";

    export class BadRequestsException extends HttpException{
        constructor(message:string , errorCode:ErrorCodes , errors: string[] | null = null){
            super(message , errorCode , 400 , errors) 
        }
    }