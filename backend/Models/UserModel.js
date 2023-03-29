const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userModel=mongoose.Schema({
      name:{type:String,required:true},
      email:{type:String,required:true,unique:true},
      password:{type:String,required:true},
      avatar:{type:String,required:true,default:"https://st4.depositphotos.com/14903220/22197/v/1600/depositphotos_221970610-stock-illustration-abstract-sign-avatar-icon-profile.jpg"},
},
{
      timestamps:true,
});

userModel.methods.checkpassword=async function(enteredPassword){
      return await bcrypt.compare(enteredPassword,this.password);
};

userModel.pre('save',async function(next){
      if(!this.isModified){
            next();
      }
      const salt=await bcrypt.genSalt(10);
      this.password=await bcrypt.hash(this.password,salt);
})

const User=mongoose.model("User",userModel);

module.exports=User;