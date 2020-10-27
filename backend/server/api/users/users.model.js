var mongoose =require('mongoose')
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    email:String,
    username: {type:String},
    password:String,
role:String,
crtdate:Date,
IP:String,
status: {type:Boolean, default: true},
lastLogin: {
    type: Date,
    default: Date.now
},
})

module.exports=mongoose.model('User', UserSchema);