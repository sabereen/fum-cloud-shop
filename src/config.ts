import path = require('path');

export default {
    mongo: {
        uri: process.env['MONGO_URI'] || 'mongodb://db:27017/',
    },
    auth:{
        uri: process.env['AUTH_URI'] || 'http://auth:2000/authentiq/v1'
    },
    port: process.env['PORT'] || 6672,
    apiRoot: process.env['API_ROOT'] || 'http://127.0.0.1:6672/account',
    clientRoot: process.env['CLIENT_ROOT'] || 'http://127.0.0.1:8080',
    clientPath: process.env['CLIENT_PATH'] || path.resolve(__dirname, '../../fum_cloud_shop/dist'),
    zarinpalMerchant: process.env['ZARINPAL_MERCHANT'],
    zarinpalSandbox: process.env['ZARINPAL_SANDBOX'] === 'TRUE',
    AccountList: [{
        method: "PUT",
        url: "/account/profile"
    }, {
        method: "GET",
        url: "/account/profile"
    }, {
        method: "GET",
        url: "/account/wallet"
    }, {
        method: "POST",
        url: "/account/pay"
    }, {
        method: "GET",
        url: "/account/transaction"
    }]
}
