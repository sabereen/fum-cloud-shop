import { JsonController, Get,  Post,  Body, Res, OnUndefined, HeaderParam, QueryParams, Authorized, UnauthorizedError, BodyParam } from "routing-controllers";
import Profile, { ProfileModel } from "../schemas/Profile";
import { ErrorController } from "./ErrorController";
import { validate } from "../services/authValidate";
import Transaction, { TransactionModel } from "../schemas/Transaction";
import { pay, checkPayment } from "../services/payment";
import express = require('express');
import { Type } from "class-transformer";
import { WalletModel } from "../schemas/Wallet";
import config from "../config";
const http = require("http");
class caQueryParams {
    @Type(() => String)
    authority : string;
    @Type(() => String)
    transactionID : string;
    Status?:string
}
@JsonController('/pay')
export class PayController {
    statusCode: any
    error: ErrorController
    @Authorized()
    @Post('')
    @OnUndefined(this.error)
    async post(@BodyParam('orderID',{required:true}) order: any, @HeaderParam("authorization") token: string, @Res() response:express.Response) {
        //console.log(profile)
        if(!token){
            throw new UnauthorizedError('need authorized')
        }
        let newTransaction: Transaction
        const {
            orderID
        } = order;
        newTransaction = new Transaction()


        try {
            const responce = await validate(token)
            this.statusCode = responce['statusCode']
            // let profile = new Profile()
            if (this.statusCode == 200) {
                const query = {
                    email: JSON.parse(responce['body']).email
                };
                try {
                    const profile = await ProfileModel.findOne(query, { _id: 1 })
                    try {
                       
                        newTransaction.amount = 100
                        newTransaction.createdAt = new Date()
                        newTransaction.modifiedAt = new Date()
                        newTransaction.orderId = orderID
                        newTransaction.profile = profile['_id']
                        const id =await TransactionModel.create(newTransaction);
                        // console.log(id)
                        try{
                        let result = await pay({ price: 100, callbackUrl: config.callback.uri+'?transactionID='+id['_id']})
                        response.status(this.statusCode)
                        try {
                            await TransactionModel.updateOne({ _id: id }, {refId:result.authority}, (err, raw) => { return raw })
                            response.status(this.statusCode)
                           // return result
                            return response.redirect(result.url)
                        }
                        catch (error) {
                            console.error('ERROR:');
                            console.error(error);
                        }
                        }
                        catch (error) {
                            console.error('ERROR:');
                            console.error(error);
                        }
                        
                    }
                    catch (error) {
                        console.error('ERROR:');
                        console.error(error);
                    }
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
    @Get('/callback')
    @OnUndefined(this.error)
    async get(@QueryParams() param: caQueryParams, @Res() response:express.Response) {
        try {
            // console.log(param)
            let price:number
            const transaction = await TransactionModel.findOne({ _id: param.transactionID },{_id:0})
            // console.log(transaction) 
            price = transaction['amount']
            // console.log(param.Status)
            if(param.Status && param.Status=='OK'){
                
                await WalletModel.update({profile:transaction.profile},{value:price},(err,raw)=>{return raw})
            }
           
            response.status(200)
            this.createPromise(checkPayment(param.authority,price),500)
            return ''


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
