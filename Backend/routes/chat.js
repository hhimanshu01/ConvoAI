import express from "express";
import Thread from "../models/threadSchema.js";
const router = express.Router();
import getOpenAIAPIResponse from "../utils/openai.js";

//test
router.post("/test", async (req, res)=>{
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing new Thread"
        });
       const response = await thread.save();
       res.send(response);
    }
    catch(err){
        res.status(500).json({error: "Failed to save in DB"});
    }
});

//Get all threads
router.get("/thread", async (req, res)=>{
    try{
        const threads = await Thread.find({}).sort({updatedAt: -1}); //-1: descending order
        res.json(threads); //returning the threads
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// All msgs of a thread - means a complete chat
router.get("/thread/:threadId", async (req, res)=>{
    const {threadId} = req.params;
    try{
        const thread = await Thread.findOne({threadId});
        if(!thread){
            res.status(404).json({error: "Thread not found"});
        }
        res.json(thread.messages);
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
  
});


//Delete route
router.delete("/thread/:threadId", async (req, res)=>{
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});
        if(!deletedThread){
            res.status(404).json({error: "Thread could not be deleted"});
        }
        res.status(200).json({success: "Thread deleted successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to delete threads"});
    }
});

router.post("/chat", async (req, res)=>{
    const {threadId, message} = req.body;
    if(!threadId || !message){
            return res.status(400).json({error: "Missing required fields"});
        }

    try
    {
        let thread = await Thread.findOne({threadId});

        if(!thread)
        {                             //thread does not exist create new thread in db
            thread = new Thread({
                threadId : threadId,
                title: message,
                messages: [{role: "user", content: message}]
            });
        }

        else
        {
            thread.messages.push({role: "user", content: message});
        }

        const assistantReply = await getOpenAIAPIResponse(message);
        thread.messages.push({role: "assistant", content: assistantReply});
        thread.updatedAt = new Date();

        await thread.save();

        res.json({assistantReply : assistantReply}); //send reply to frontend
    }
    catch(err)
    {
        console.log(err);
        res.status(500).json({error: "Something went wrong"});
    }
});


export default router;