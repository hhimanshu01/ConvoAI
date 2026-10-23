import "./Chat.css";
import {useContext, useState, useEffect} from "react";
import {MyContext} from "./MyContext.jsx"

function Chat() {

    const {newChat, prevChats, reply} = useContext(MyContext);
    // const[latestReply, setLatestReply] = useState(null);

    return (
        <>
        {newChat && <h1>Start a New Chat!</h1>}
        <div className="chats">
            {
                prevChats?.map((chat, idx) => 
                    
                <div className={chat.role === "user"?"userDiv": "assistantDiv"} key ={idx}>
                {
                    chat.role === "user"? <p className="userMsg">{chat.content}</p> : 
                    <p className="assistantMsg">{chat.content}</p>
                    // <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                }
                </div>
            )
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
    );
}

export default Chat;

 