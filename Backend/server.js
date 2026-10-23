import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoute from "./routes/chat.js";

const app = express();

app.use(express.json());
app.use(cors());

let port = 8080;
app.listen(port, ()=>{
    console.log("app is listening");
    connectDB();
});


app.use("/api" , chatRoute);

// connecting with db
const connectDB = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("Connected with db");
    }
    catch(err){
        console.log("Failed to connect with db", err);
    }
}


