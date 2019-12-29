import { Typegoose, prop, Ref } from "typegoose";

export class Profile extends Typegoose {
}

export default Profile

export const ProfileModel = new Profile().getModelForClass(Profile)
