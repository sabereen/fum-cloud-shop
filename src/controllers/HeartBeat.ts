import { JsonController, Get, Param, Post, Put, Authorized, Body } from "routing-controllers";

@JsonController('/heartbeat')
export class HeartBeatController {
    @Get('')
    get() {
        return {
            message: 'Account Management is up and running'
        }
    }
}
