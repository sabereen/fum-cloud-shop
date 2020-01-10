
import config from "../config";
const request = require('request');
export async function register(data) {

    //console.log(data)
    return new Promise((resolve, reject) => {
        request({
            method: 'post',
            uri:  config.auth.uri+ '/user/register',
            json: {
                email: JSON.parse(data).email, password: JSON.parse(data).password
            }

        }, (error, response, body) => {
            //console.log(body)
            if (error) reject(error);
            if (response.statusCode != 201) {
                resolve({ statusCode: response.statusCode, message: body.message });
            }
            resolve({ statusCode: response.statusCode, message: body.message, token:body.token });
        });
    });

}
// options.multipart= [
//     {
//       'content-type': 'application/json',
//       body: data
//     }]
//   let reques = await http.request(options, (repons) => {
//         repons.setEncoding('utf8');
//         repons.on('data', (d) => {
//             return {
//                 statusCode:repons.statusCode,
//                 message: JSON.parse(d).message.toString()
//             }
//         })
//     })

//     reques.on('error', (error) => {
//         return error.json("error in server")
//     })

//     reques.write(data)
//     reques.end()
//     return 'kkk'
// request('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
//     if (err) { return console.log(err); }
//     console.log(body.url);
//     console.log(body.explanation);
// });
// multipart: [
//   {
//     'content-type': 'application/json',
//     body: JSON.stringify({email:JSON.parse(data).email,password:JSON.parse(data).password})
//   }

// ],
 // const options = {
//     uri: 'http://'+config.auth.uri+':2000'+'/auth/v1/user/register',
//     // port: 2000,
//     // path: '/auth/v1/user/register',
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     multipart:[]
// }
// const reques =http.request(options, (repons) => {
//     repons.setEncoding('utf8');
//     repons.on('data', (d) => {
//             let response={
//             statusCode:repons.statusCode,
//             message: JSON.parse(d).message.toString()
//             }
//             resolve(response)
//     })
// })

// reques.on('error', (error) => {
//    reject(error)
// })

// reques.write(data)
// reques.end()