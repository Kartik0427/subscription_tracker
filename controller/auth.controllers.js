import mongoose from "mongoose"
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import {JWT_SECRET, JWT_EXPIRES_IN} from '../config/env.js'
import User from '../models/user.model.js'


export const signUp = async(req,res,next)=>{
    //Implement signup logic
    const session =  await mongoose.startSession();
    session.startTransaction();
    try{
        const {name , password, email } = req.body;
        const existingUser =  await User.findOne({email})
        if(existingUser)
        {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
       const newusers = await  User.create([{name, password: hashedPassword,email}],{session});

       const token = jwt.sign({userId : newusers[0]._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN})
        await session.commitTransaction();
        session.endSession();


        res.status(201).json({
            success: true,
            message: "user created successfully",
            data :
            {
                token,
                user : newusers[0],
            }
        })
    }
    catch(error)
    {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async(req,res,next)=>{
    //Implement signin logic
    try{
        const {email, password} = req.body;
        const user = await User.findOne(email);
        if(!user)
        {
            const error = new Error("User not found");
            error.statusCode(404);
            throw error;
        }
        const isValidPassword = await bcrypt.compare(password,user.password);

        if(!isValidPassword)
        {
            const error = new Error("Wrong Password");
            error.statusCode(401);
            throw error;  
        }

        const token = jwt.sign({userId: user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});
        res.status(200).json({
            success: true,
            message: "user signed in successfully",
            data :
            {
                token,
                user,
            }
        });}
    catch(error)
    {
        next(error);
    }
}

export const signOut = async(req,res,next)=>{
    //Implement signout logic
}