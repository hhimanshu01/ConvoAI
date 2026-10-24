import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import {MyContext} from "./MyContext.jsx"
import { useContext, useState, useEffect} from "react";
import { PropagateLoader } from "react-spinners";


function ChatWindow(){
    const {prompt, setPrompt, reply, setReply, currThreadId, prevChats, setPrevChats, setNewChat} = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [displayAbout, setDisplayAbout] = useState(false);

    const getReply = async ()=>{
        setLoading(true);
        
        const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
                message: prompt,
                threadId: currThreadId,
        })
    };
        try{
            const response = await fetch("http://localhost:8080/api/chat", options);
            const res = await response.json();
            setReply(res.assistantReply);
            setNewChat(false); //so that "Start New Chat doesn't display"
            console.log(res.assistantReply);
        }
        catch(err){
        console.log(err);
        }
        setLoading(false);
    }
    

    //using useEffect to update prevChats variable
    useEffect(()=>{
       if(prompt && reply){
        setPrevChats(prevChats=>(
            [...prevChats, 
            {
                role: "user",
                content: prompt
            },
            {
                role: "assistant",
                content: reply
            }]
        ));
       }
    // as soon as user ka msg save krva liya prevChats m setPrompt to empty string again
    setPrompt(""); 

    }, [reply])

    let handleIsOpen = () => {
        setIsOpen(!isOpen) ; //toggle
    }

    let handleDisplay = () => {
        setDisplayAbout(!displayAbout); // toggle
    }

    return(
         <div className="ChatWindow">
        
           <div className="navbar">
            <span className="aboutS">ConvoAI <i className="fa-solid fa-chevron-down" onMouseEnter={handleDisplay} onMouseLeave={handleDisplay}></i></span>
            <div className="userIconDiv">
                <span className="userIcon"><i className="fa-solid fa-user" onClick={handleIsOpen}></i></span>
            </div>
           </div>
            {
                displayAbout && <div className="about"><p>Your AI, your ideas. An AI assistant built to help you think, learn, and create.</p></div>
            }
           {
            isOpen && <div className="dropDown">
                <div className="dropDownItem"> <i class="fa-solid fa-gear"></i> &nbsp; Settings</div>
                <div className="dropDownItem"><i class="fa-solid fa-cloud-arrow-up"></i> &nbsp; Upgrade Plan</div>
                <div className="dropDownItem"><i class="fa-solid fa-right-from-bracket"></i> &nbsp; Log out</div>
            </div>
           }

           <Chat></Chat>
           <PropagateLoader color="#36d7b7" loading = {loading}/>

           <div className="chatInput">
            <div className="inputBox">
                <input placeholder="Ask Anything"
                value={prompt} onChange={(event)=> setPrompt(event.target.value)}
                onKeyDown={(event)=> event.key === 'Enter'?getReply(): ''}></input>
            <div id="submit" onClick={getReply}><i className="fa-solid fa-circle-arrow-up"></i></div>
            </div>
            <p className="info">ConvoAI can make mistakes. Check important info. See Cookie Preferences.</p>
           </div>
        </div>
    );
}

export default ChatWindow;

