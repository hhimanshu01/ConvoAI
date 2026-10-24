import "./Chat.css";
import {useContext, useState, useEffect} from "react";
import {MyContext} from "./MyContext.jsx"
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

function Chat(){
    const {newChat, prevChats, reply} = useContext(MyContext);
    const[latestReply, setLatestReply] = useState(null);

    useEffect(()=>{
        // loading prev chats
        if(reply === null){
            setLatestReply(null);
            return;
        }
        if(!prevChats?.length) return;

        const content = reply.split(" ");

        let idx = 0;
        const interval = setInterval(()=>{
            setLatestReply(content.slice(0, idx+1).join(" "));
            idx++;
            if(idx>=content.length) clearInterval(interval);

        }, 30);

        return ()=> clearInterval(interval); //react cleanup function

    },[prevChats, reply])

    return (
        <>
        {newChat && <h1>Start a New Chat!</h1>}
        <div className="chats">
            {
              prevChats?.slice(0, -1).map((chat, idx) => 
                <div className={chat.role === "user"?"userDiv": "assistantDiv"} key ={idx}>
                {
                    chat.role === "user"? <p className="userMsg">{chat.content}</p> : 
                    // <p className="assistantMsg">{chat.content}</p>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                }
                </div>
            )
            }
            {
                prevChats.length > 0 && latestReply !=null &&
                <div className="assistantDiv" key = {"typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                </div>
            }

            {/* displaying other than the typing effect */}
            {
                prevChats.length > 0 && latestReply == null &&
                <div className="assistantDiv" key = {"typing"}>
                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                </div>
            }
        </div>



        {/* <div className="chats">
            <div className="userDiv">
                <p className="userMsg">This is a user message!</p>
            </div>
            <div className="assistantDiv">
                <p className="assistantMsg">This is the assistant reply!</p>
            </div>
        </div> */}
       
        </>
    )
}
export default Chat;