import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const auth = async (req, res, next) => {
  try{
    const token = await req.header('Authorization').replace('Bearer ', '')
    const decoded = await jwt.verify(token, "thisismynewcourse");
    const user = await User.findOne({_id: decoded._id,"tokens.token": token});
    if(!user){
        throw new Error()
    }
    req.token = token
    req.user = await user;
    next();
  }catch(e){
    res.status(401).send({ error: 'Pls auth'})
  }
  
};
