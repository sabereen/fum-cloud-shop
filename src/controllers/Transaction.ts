import { JsonController, Get, Param, Post, Put, Authorized, Body, Res, OnUndefined, HttpError, HeaderParam } from "routing-controllers";
import Profile, { ProfileModel } from "../schemas/Profile";
import { ErrorController } from "./ErrorController";
import { getRole } from "../services/authGetRole";
import { TransactionModel } from "../schemas/Transaction";
const http = require("http");
@JsonController('/transaction')
export class TransactionController {
    statusCode: any
    error: ErrorController

    @Get('')
    @OnUndefined(this.error)
    async get(@HeaderParam("authorization") token: string) {
        try {
            const responce = await getRole(token)
            this.statusCode = responce['statusCode']
            let profile = new Profile()
            if (this.statusCode == 200) {
                const query = {
                    email: JSON.parse(responce['body']).email
                };
                try {
                   profile= await ProfileModel.findOne(query,{_id:1})
                   return this.createPromise(TransactionModel.find({'profile':profile['_id']}), 500)
                }
                catch (error) {
                    console.error('ERROR:');
                    console.error(error);
                }
            }
            else {
                this.error = new ErrorController(this.statusCode, responce['message'])
                return { message: responce['message'] }
            }
        } catch (error) {
            console.error('ERROR:');
            console.error(error);
        }
    }

    private createPromise(data: any, timeout: number): Promise<any> {
        return new Promise<any>((ok, fail) => {
            setTimeout(() => ok(data), timeout);
        });
    }
}