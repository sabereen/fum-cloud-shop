import { JsonController, Get, Param, Post, Put, Authorized, Body, Res, OnUndefined, HttpError, HeaderParam, BadRequestError, UnauthorizedError } from "routing-controllers";
import Profile, { ProfileModel } from "../schemas/Profile";
import Wallet, { WalletModel } from "../schemas/Wallet";
import config from "../config";
import { register } from "../services/authRegister";
import { request } from "http";
import { ErrorController } from "./ErrorController";
// import { login } from "../services/authLogin";
import { validate } from "../services/authValidate";
import express = require('express');
const http = require("http");
@JsonController('/profile')
export class ProfileController {
    statusCode: any
    error: ErrorController
    @Post('')
    @OnUndefined(this.error)
    async post(@Body() profile: any,@Res() response:express.Response) {
        //console.log(profile)
        let newProfile: Profile
        let newWallet: Wallet
        if(!profile.email || !profile.password){
             throw new BadRequestError('need email and password')
        }
        const {
            email,
            password,
            name,
            phoneNo,
            nationalCode,
            address,
            postalCode
        } = profile;
        newProfile = new Profile()
        newWallet = new Wallet()
        const data = JSON.stringify({
            email: email.toString(),
            password: password.toString()
        });

        try {
            const responce = await register(data)
            this.statusCode = responce['statusCode']
            if (this.statusCode == 201) {
                newProfile.email = email
                newProfile.name = name
                newProfile.phoneNo = phoneNo
                newProfile.nationalCode = nationalCode
                newProfile.address = address
                newProfile.postalCode = postalCode;
                // (async () => {
                    const id = await ProfileModel.create(newProfile);
                    newWallet.profile = id._id
                    newWallet.value = 0
                    await WalletModel.create(newWallet);
                // })();
                
                try {
                    //const Token = await login(data)
                    //return Token
                    response.status(this.statusCode)
                    return {token:responce['token']}
                } catch (error) {
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
    @Authorized()
    @Get('')
    @OnUndefined(this.error)
    async get(@HeaderParam("authorization") token: string, @Res() response:express.Response) {
        try {
            //console.log(token)
            if(!token){
                throw new UnauthorizedError('need authorized')
            }
            const responce = await validate(token)
            this.statusCode = responce['statusCode']
            //console.log(responce)
            let profile = new Profile()
            if (this.statusCode == 200) {
                const query = {
                    email: JSON.parse(responce['body']).email
                };
                response.status(this.statusCode)
                return this.createPromise(ProfileModel.findOne(query), 500)
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
    @Authorized()
    @Put('')
    @OnUndefined(this.error)
    async put(@Body({required:true}) upProfile: any, @HeaderParam("authorization") token: string, @Res() response:express.Response) {
        //console.log(token)
        if(!token){
            throw new UnauthorizedError('need authorized')
        }
        try {

            const {
                name,
                phoneNo,
                nationalCode,
                address,
                postalCode
            } = upProfile
            //let profile = new Profile()
            //console.log(upProfile,token)
            const responce = await validate(token)
            //console.log(responce)
            this.statusCode = responce['statusCode']
            //console.log(responce)

            if (this.statusCode == 200) {
                const userUpdate = {
                    name: name,
                    email: JSON.parse(responce['body']).email,
                    phoneNo: phoneNo,
                    nationalCode: nationalCode,
                    address: address,
                    postalCode: postalCode
                }
                try {
                    await ProfileModel.updateOne({ email: userUpdate.email }, userUpdate, (err, raw) => { return userUpdate })
                    response.status(this.statusCode)
                    return upProfile
                }
                catch (error) {
                    console.error('ERROR:');
                    console.error(error);
                }
                //return this.createPromise(ProfileModel.updateOne({email:userUpdate.email},userUpdate,(err,raw)=>{return userUpdate}), 500)
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