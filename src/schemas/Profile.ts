import { Typegoose, prop, Ref } from "typegoose";
import * as mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/profile');
let newProfil:any
let callba:any
let emai:any
let profile:any
export class Profile extends Typegoose {
    constructor(){
        super();
    }
    createProfile (newProfile, callback)  {
        // console.log("lll")
        newProfil=newProfile
        callba=callback
        save()
       //createProfile(newProfile,callback)
     };
     getUserByEmail = (email) => {
         emai = email
         get()
         console.log(profile)
        return profile
    };
    @prop({
        required:true,
        index:true,
        unique:true,
        lowercase:true})
    email: string
    
    @prop()
    name: string

    @prop()
    phoneNo: string

    @prop()
    nationalCode: string

    @prop()
    address: string

    @prop()
    postalCode: string

   
}

export default Profile

export const ProfileModel = new Profile().getModelForClass(Profile);

export function save (){
    (async () => {
        //const u = new newProfile({ name: 'JohnDoe' });
        await ProfileModel.create(newProfil);
        //const user = await ProfileModel.findOne();
        //console.log(user); // { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
      })();
}

export function get (){
    (async () => {
        const query = {
            email:emai
        };
       
        profile =  ProfileModel.findOne(query);
        
      })();
}