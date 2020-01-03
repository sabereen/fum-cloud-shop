import { JsonController, Get, Param, Post, Put, Authorized, Body, Res, OnUndefined, HttpError, HeaderParam } from "routing-controllers";
import Profile, { ProfileModel } from "../schemas/Profile";
import Wallet, { WalletModel } from "../schemas/Wallet";
import config from "../config";
import { register } from "../services/authRegister";
import { request } from "http";
import { ErrorController } from "./ErrorController";
import { login } from "../services/authLogin";
import { getRole } from "../services/authGetRole";
import Transaction, { TransactionModel } from "../schemas/Transaction";
import { pay, checkPayment } from "../services/payment";
const http = require("http");
@JsonController('/pay')
export class PayController {
    statusCode: any
    error: ErrorController
    @Post('')
    @OnUndefined(this.error)
    async post(@Body() order: any, @HeaderParam("authorization") token: string) {
        //console.log(profile)
        let newTransaction: Transaction
        const {
            orderID
        } = order;
        newTransaction = new Transaction()


        try {
            const responce = await getRole(token)
            this.statusCode = responce['statusCode']
            // let profile = new Profile()
            if (this.statusCode == 200) {
                const query = {
                    email: JSON.parse(responce['body']).email
                };
                try {
                    const profile = await ProfileModel.findOne(query, { _id: 1 })
                    try {
                        let result = await pay({ price: 100, callbackUrl: 'http://localhost' })
                        newTransaction.amount = 100
                        newTransaction.createdAt = new Date()
                        newTransaction.modifiedAt = new Date()
                        newTransaction.orderId = orderID
                        newTransaction.profile = profile['_id']
                        newTransaction.statusCode = result.status
                        newTransaction.refId = result.authority;
                        (async () => {
                            const id =await TransactionModel.create(newTransaction);
                            console.log(id)
                        })();
                        return result.url
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
        } catch (error) {
            console.error('ERROR:');
            console.error(error);
        }
    }
    @Get('/callback')
    @OnUndefined(this.error)
    async get(@Param('authority') authority: string, @Param('transactionID') transactionID: number) {
        try {
            let price:number
            const amount = await ProfileModel.findOne({ _id: transactionID }, { 'amount': 1, _id: 0 })
            price = amount['amount']
            checkPayment(authority,price)
            return 


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