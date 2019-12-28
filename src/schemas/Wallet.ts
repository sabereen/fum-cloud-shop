import { Typegoose, prop, Ref } from "typegoose";

export class Wallet extends Typegoose {
}

export default Wallet

export const WalletModel = new Wallet().getModelForClass(Wallet)
