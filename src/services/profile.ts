import Profile, { ProfileModel } from "../schemas/Profile";

const express = require('express');
const router = express.Router();

const http = require("http");
const querystring = require("querystring");
const request = require('request');
const profile = require('../schemas/Profile');
const wallet = require('../schemas/Wallet');
const authUrl = "http://127.0.0.1:2000/auth/v1/user"

router.get('/heartbeat', function (req, res, next) {
    return res.status(200).json("Account Management is up and runing");
});
let newProfile: Profile
router.post('/profile', (req, res, next) => {

    const {
        email,
        password,
        name,
        phoneNo,
        nationalCode,
        address,
        postalCode
    } = req.body;
    newProfile = new Profile()

    // console.log(newProfile)
    const data = JSON.stringify({
        email: email.toString(),
        password: password.toString()
    });

    const options = {
        host: "127.0.0.1",
        port: 2000,
        path: '/auth/v1/user/register',
        method: 'POST',

        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        }

    };

    const reques = http.request(options, (repons) => {

        repons.setEncoding('utf8');
        repons.on('data', (d) => {

            if (repons.statusCode == 201) {
                newProfile.email = email
                newProfile.name = name
                newProfile.phoneNo = phoneNo
                newProfile.nationalCode = nationalCode
                newProfile.address = address
                newProfile.postalCode = postalCode

                newProfile.createProfile(newProfile, (err, usr) => {
                    if (err || !usr) {

                        return next(err);
                    }
                    //  return res.status(rm.registerSuccessful.code).json(rm.registerSuccessful.msg);
                });
                
                return login(data)
            }
            else {
                return res.json(JSON.parse(d).message)
            }
        })
    })

    reques.on('error', (error) => {
        return error.json("error in server")
    })

    reques.write(data)
    reques.end()
    function login(data){
        options.path = '/auth/v1/user/login'
        const reques = http.request(options, (repons) => {

            repons.setEncoding('utf8');
            repons.on('data', (d) => {
    
                if (repons.statusCode == 200) {
                   
    
                    return res.json(JSON.parse(d))
                    
                   
                }
                else {
                    return res.json(JSON.parse(d).message)
                }
            })
        })
    
        reques.on('error', (error) => {
            return error.json("error in server")
        })
    
        reques.write(data)
        reques.end()
    }

});


module.exports = router;