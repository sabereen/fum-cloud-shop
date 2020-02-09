import { Typegoose, prop, Ref } from "typegoose";
import * as mongoose from 'mongoose';
import config from "../config";

export class Profile extends Typegoose {
    @prop({required:true,index:true,lowercase:true})
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

export const ProfileModel = new Profile().getModelForClass(Profile)
