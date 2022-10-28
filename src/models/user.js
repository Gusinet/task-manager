import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { Task } from "./task.js";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("invalide eMail");
      }
    },
  },
  age: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
    require: true,
    trim: true,
    minlength: 7,
    validate(passw) {
      if (passw.includes("password")) {
        throw new Error("must not contain password");
      }
    },
  },
  tokens :[{
    token: {
      type: String,
      required: true
    }
  }]
},
{
  timestamps: true
});

userSchema.virtual('tasks',{
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
})




userSchema.methods.toJSON = function (){
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens

  return userObject
}

userSchema.methods.generateAuthToken = async function (){
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse')

  user.tokens = user.tokens.concat({ token })
  await user.save()
  
  return token
}





userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne ({email})
  if (!user){
    throw new Error ('unable to login')
  }
  const isMatch = await bcrypt.compare(password, user.password)

  if(!isMatch){
    throw new Error ('unable to login')
  }
  return user
}




// Hash the password
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});



//delete user task whan deleting user
userSchema.pre('remove', async function(next){
  const user = this

  await Task.deleteMany({ owner: user._id })
  next()
})

export const User = mongoose.model("User", userSchema);
