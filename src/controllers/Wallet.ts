import { JsonController, Get, Param, Post, Put, Authorized, Body, Res, OnUndefined, HttpError, HeaderParam, UnauthorizedError } from "routing-controllers";
import Profile, { ProfileModel } from "../schemas/Profile";
import Wallet, { WalletModel } from "../schemas/Wallet";
import config from "../config";
import { register } from "../services/authRegister";
import { request } from "http";
import { ErrorController } from "./ErrorController";
import { validate } from "../services/authValidate";
import express = require('express');
const http = require("http");
@JsonController('/wallet')
export class WalletController {
    statusCode: any
    error: ErrorController
    @Authorized()
    @Get('')
    @OnUndefined(this.error)
    async get(@HeaderParam("authorization") token: string, @Res() response:express.Response) {
        if(!token){
            throw new UnauthorizedError('need authorized')
        }
        try {
            const responce = await validate(token)
            this.statusCode = responce['statusCode']
            let profile = new Profile()
            if (this.statusCode == 200) {
                const query = {
                    email: JSON.parse(responce['body']).email
                };
                try {
                   profile= await ProfileModel.findOne(query,{_id:1})
                   response.status(this.statusCode)
                   return this.createPromise(WalletModel.findOne({'profile':profile['_id']},{'value':1,_id:0}), 500)
                }
                catch (error) {
                    console.error('ERROR:');
                    console.error(error);
                }
            }
            else {
                this.error = new ErrorController(this.statusCode, responce['message'])
                response.status(this.statusCode)
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