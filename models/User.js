const mongoose =require('mongoose');
const UserSchema = new mongoose.Schema({
firstName:{type: String,required:true},
lastName:{type: String,required:true,default:" "},
email:{type: String,required:true},
googleid:{type:String,required:true},
emailstatus:{type:Boolean,required:true},
picture:{type:String,required:true},

});
module.exports = mongoose.model("User", UserSchema);
