import { Typegoose, prop, Ref } from "typegoose";

export class Profile extends Typegoose {
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
    address: number

    @prop()
    postalCode: string
}

export default Profile

export const ProfileModel = new Profile().getModelForClass(Profile)
