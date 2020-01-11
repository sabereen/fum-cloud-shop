import { RoutingControllersOptions, createExpressServer, HttpError, Action } from 'routing-controllers'
import config from './config';
import * as express from 'express';
import { HeartBeatController } from './controllers/HeartBeat'

import './services/database'
import { ProfileController } from './controllers/Profile';
import { WalletController } from './controllers/Wallet';
import { PayController } from './controllers/Pay';
import { TransactionController } from './controllers/Transaction';
import log = require('morgan');
// disable classToPlain class-transformer
require('class-transformer')['classToPlain'] = function (obj: object)  {
    return JSON.parse(JSON.stringify(obj))
}



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
        
    },
    async authorizationChecker(action: Action, roles: string[]) {
        
        try {
            let token: string = action.request.headers['authorization']
            if(token){
                return true
            }

            return false

        } catch(err) {
            return false
        }
       
    }
}

const account: express.Application = createExpressServer(appOptions)
const app = express()
app.use(log('combined'));
app.use('/account', (req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    next()
})
app.use('/account', account)

app.use(express.static(config.clientPath))

app.use((req, res, next) => {
    res.status(404)
})

app.listen(config.port, () => {
    console.log('listening on port ' + config.port)
})
