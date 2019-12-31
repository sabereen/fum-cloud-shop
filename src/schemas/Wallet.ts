import { Typegoose, prop, Ref } from "typegoose";
import Profile from "./Profile";
import * as mongoose from 'mongoose';
mongoose.connect('mongodb://localhost:27017/wallet');
let newWalle:any
let callba:any
export class Wallet extends Typegoose {
    constructor(){
        super();
    }
    createWallet (newWallet, callback)  {
        // console.log("lll")
        newWalle=newWallet
        callba=callback
        save()
        
       //createProfile(newProfile,callback)
     };
    @prop({required:true})
    value: number

    @prop({ ref: Profile })
    profileID: Ref<Profile>
}

export default Wallet

export const WalletModel = new Wallet().getModelForClass(Wallet)
export function save (){
    (async () => {
        //const u = new newProfile({ name: 'JohnDoe' });
         await WalletModel.create(newWalle);
        
        //const user = await WalletModel.findById(_id);
        //console.log(user); // { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
      })();
}