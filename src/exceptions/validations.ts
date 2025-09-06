import { HttpException, ErrorCodes } from "./root";

export class UnprocessableEntity extends HttpException {
  constructor(errors: any[], message: string = "Unprocessable entity") {
    super(
      message,
      ErrorCodes.UNPROCESSABLE_ENTITY,
      422,
      errors
    );
  }
}
