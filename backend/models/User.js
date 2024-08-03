const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true
    },
    bio:{
        type:String,
        trim:true
    },
    profilePicture:{
        type:String,
        default:""
    },
    coverPicture:{
        type:String,
        default:""
    },
    posts:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }],
    followers:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    following:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    blockList:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    highlights: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    mutedAccounts: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    savedPost: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],
    isPrivate: [{
        type: mongoose.Schema.Types.Boolean,
        ref: "User"
    }]
},{timestamps:true})

const User=mongoose.model("User",userSchema)

module.exports=User