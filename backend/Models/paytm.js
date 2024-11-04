const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  UserSchema = new Schema({
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:false
    }
})

const AcoountSchema= new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    balance:{
        type:Number,
        required:true
    }

})

const User = mongoose.model("user", UserSchema);
const Account = mongoose.model("accounts",AcoountSchema)
module.exports = {User,Account};
