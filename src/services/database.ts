import * as mongoose from "mongoose"
import config from "../config"

// mongoose.SchemaTypes.ObjectId['get'](v => v.toString())

mongoose.connect(config.mongo.uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) return console.log('database connection error!')
    console.log('database connected')
})
