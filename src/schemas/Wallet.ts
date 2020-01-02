import { Typegoose, prop, Ref } from "typegoose";
import Profile from "./Profile";

export class Wallet extends Typegoose {
    @prop()
    value: number

    @prop({ ref: Profile })
    profile: Ref<Profile>
}

export default Wallet

export const WalletModel = new Wallet().getModelForClass(Wallet)
