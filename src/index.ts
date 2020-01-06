import { RoutingControllersOptions, createExpressServer, HttpError, Action } from 'routing-controllers'
import config from './config';
import * as express from 'express';
import { HeartBeatController } from './controllers/HeartBeat'

import './services/database'
import { ProfileController } from './controllers/Profile';
import { WalletController } from './controllers/Wallet';
import { PayController } from './controllers/pay';
import { TransactionController } from './controllers/Transaction';

// disable classToPlain class-transformer
require('class-transformer')['classToPlain'] = function (obj: object)  {
    return JSON.parse(JSON.stringify(obj))
}

// ساختار خطاهای اچ‌تی‌تی‌پی را که به سمت کلاینت می‌روند زیباتر می‌کنیم
// HttpError.prototype['toJSON'] = function () {
//     return {
//         message: this.message,
//         httpCode: this.httpCode,
//         code: this.httpCode
//     }
// }

const appOptions: RoutingControllersOptions = {
    controllers: [
        HeartBeatController,
        ProfileController,
        WalletController,
        PayController,
        TransactionController
    ],
    defaults: {
        paramOptions: {
            required: true
        }
    },
    cors: true,
    classTransformer: true,
    async currentUserChecker(action: Action) {
        return {}
        // try {
        //     let token = action.request.headers['authorization']
        //     if (token.startsWith('Bearer')) {
        //         token = token.slice('Bearer '.length)
        //     }
        //     const user = await jwt.verify(token)
        //     return user
        // } catch(err) {
        //     return null
        // }
    },
    async authorizationChecker(action: Action, roles: string[]) {
        // for (let index = 0; index < config.AccountList.length; index++) {
        //     const {
        //         method,
        //         url
        //     } = config.AccountList[index];
            
        //     if (method === .method && url === req.path) {
        //         if (!req.headers.authorization) {
        //             return res.status(rm.noCredentials.code).json(rm.noCredentials.msg);
        //         } else {
        //             const token = req.get(sn.authorizationName).split(' ')[1]; // Extract the token from Bearer
        //             if(!await tokenResponse(token, res, next)) {
        //                 return;
        //             }
        //             else {
        //                 break;
        //             }
        //         }
        //     }
        // }
        // next();
        try {
            let token: string = action.request.headers['authorization']
            if(token){
                return true
            }

            return false

        } catch(err) {
            return false
        }
        //return true
        // try {
        //     let token: string = action.request.headers['authorization']
        //     if (token.startsWith('Bearer')) {
        //         token = token.slice('Bearer '.length)
        //     }
        //     const user = await jwt.verify(token)


        //     if (!roles.length) {
        //         return true
        //     }

        //     if (roles.some(role => user.roles.includes(role))) {
        //         return true
        //     }

        //     return false

        // } catch(err) {
        //     return false
        // }
    }
}

const account: express.Application = createExpressServer(appOptions)
const app = express()

app.use('/account', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    next()
})
app.use('/account', account)

app.use(express.static(config.clientPath))

app.use((req, res, next) => {
    res.status(404).sendFile(config.clientPath + '/index.html')
})

app.listen(config.port, () => {
    console.log('listening on port ' + config.port)
})
