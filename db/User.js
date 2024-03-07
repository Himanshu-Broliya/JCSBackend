const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config()
const SALT  = process.env.SALT

const userSchema = mongoose.Schema({
    username:String,
    password:String
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
    }
    next();
})


module.exports = mongoose.model('users',userSchema);