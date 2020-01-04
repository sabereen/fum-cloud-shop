
import config from "../config";
const request = require('request');

export async function validate(token) {
 
    return new Promise((resolve, reject) => {
        request.get(config.auth.uri+'/validate/token', (error, response, body) => {
              //console.log(body)
            if (error) reject(error);
            if (response.statusCode != 200) {
                resolve({statusCode:response.statusCode,message:body.message});
            }
            resolve({body:body,statusCode:response.statusCode});
        }).auth(null, null, true, token.split(' ')[1]);
        
        
    });

}
