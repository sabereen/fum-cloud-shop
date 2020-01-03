import {HttpError} from "routing-controllers";

export class ErrorController extends HttpError {
    constructor(statusCode,message) {
        super(statusCode, message);
    }
}