import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if(!DB_URI)
{
    throw new Error("please define the mongoDb_URI");
}

const connectTODatabase = async() =>{
    try {

        await mongoose.connect(DB_URI);
        console.log("connected to the database");
            } catch (error) {
                console.log("error connecting to the database");
                console.log(error);
                process.exit(1);
            }
}


export default connectTODatabase;