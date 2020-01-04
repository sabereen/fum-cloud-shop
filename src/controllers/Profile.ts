import { JsonController, Get, Param, Post, Put, Authorized, Body, Res, OnUndefined, HttpError, HeaderParam } from "routing-controllers";
import Profile, { ProfileModel } from "../schemas/Profile";
import Wallet, { WalletModel } from "../schemas/Wallet";
import config from "../config";
import { register } from "../services/authRegister";
import { request } from "http";
import { ErrorController } from "./ErrorController";
import { login } from "../services/authLogin";
import { validate } from "../services/authValidate";
const http = require("http");
@JsonController('/profile')
export class ProfileController {
    statusCode: any
    error: ErrorController
    @Post('')
    @OnUndefined(this.error)
    async post(@Body() profile: any) {
        //console.log(profile)
        let newProfile: Profile
        let newWallet: Wallet
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
                (async () => {
                    const id = await ProfileModel.create(newProfile);
                    newWallet.profile = id._id
                    newWallet.value = 0
                    await WalletModel.create(newWallet);
                })();
                
                try {
                    //const Token = await login(data)
                    //return Token
                    return {token:responce['token']}
                } catch (error) {
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
    @Get('')
    @OnUndefined(this.error)
    async get(@HeaderParam("authorization") token: string) {
        try {
            //console.log(token)
            const responce = await validate(token)
            this.statusCode = responce['statusCode']
            //console.log(responce)
            let profile = new Profile()
            if (this.statusCode == 200) {
                const query = {
                    email: JSON.parse(responce['body']).email
                };
                return this.createPromise(ProfileModel.findOne(query), 500)
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
    @Put('')
    @OnUndefined(this.error)
    async put(@Body() upProfile: any, @HeaderParam("authorization") token: string) {
        //console.log(token)
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