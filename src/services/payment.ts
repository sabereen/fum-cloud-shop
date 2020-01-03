import { InternalServerError, HttpError } from "routing-controllers";
import config from "../config";

const zarinpal = require('zarinpal-checkout').create('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', true)

/**
 * سناریوی پرداخت
 * 
 */

export async function pay(options: {
    price: number,
    description?: string,
    callbackUrl: string,
    email?: string,
    phone?: string,
}) {
    console.log(options)
    let result = await zarinpal.PaymentRequest({
        Amount: options.price,
        CallbackURL: options.callbackUrl,
        Description: options.description || 'pardakht',
        Email: options.email || '',
        Mobile: options.phone || ''
    })
    if (result.status != 100) {
        console.error('pre-payment error', result)
        throw new InternalServerError('خطای داخلی سرور')
    }

    return result
}

export async function checkPayment(authority: string, price: number) {
    var result = await zarinpal.PaymentVerification({
        Amount: price, // In Tomans
        Authority: authority,
    })

    if (result.status == 100 || result.status == 101) {
        return result
    } else {
        throw new Error('پرداخت انجام نشده است')
    }
}
