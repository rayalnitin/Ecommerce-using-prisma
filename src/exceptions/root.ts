// error message , status code  , error codes

export class HttpException extends Error{
    message: string;
    errorCode:ErrorCodes;
    statusCode:number;
    errors:any;

    constructor(message:string, errorCode:any, statusCode:number , errors:any){
        super(message)
        this.message = message;
        this.errorCode = errorCode;
        this.statusCode = statusCode;
        this.errors=errors;
    }
}

export enum ErrorCodes{
    USER_NOT_FOUND = 1001,
    USER_ALREADY_EXISTS = 1002, 
    INCORRECT_PASSWORDS = 1003,
    UNPROCESSABLE_ENTITY = 1004,
    INTERNAL_EXCEPTION = 1005   
}