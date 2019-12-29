import { Typegoose, prop, Ref } from "typegoose";
import Profile from "./Profile";

export class Wallet extends Typegoose {
    @prop({required:true})
    value: number

    @prop({ ref: Profile })
    profileID: Ref<Profile>
}

export default Wallet

export const WalletModel = new Wallet().getModelForClass(Wallet)
