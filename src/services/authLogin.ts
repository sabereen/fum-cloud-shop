
import config from "../config";
const request = require('request');

export async function login(data) {
 
    return new Promise((resolve, reject) => {
        request({
            method: 'post',
            uri: 'http://'+config.auth.uri+':2000'+'/auth/v1/user/login',
            json:{
                email:JSON.parse(data).email,password:JSON.parse(data).password
            }
            
          }, (error, response, body) => {
              console.log(body)
            if (error) reject(error);
            if (response.statusCode != 200) {
                resolve({statusCode:response.statusCode,message:body.message});
            }
            resolve(body);
        });
        
        
    });

}
