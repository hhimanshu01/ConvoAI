import "./Sidebar.css";
import {MyContext} from "./MyContext.jsx"
import { useContext, useEffect} from "react";
import {v4 as uuidv4} from "uuid"
import logo from "./assets/Logo.png";

function Sidebar(){
    const {allThreads, currThreadId, setAllThreads, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

    const getAllThreads = async ()=>{
        try{
            const response = await fetch("http://localhost:8080/api/thread");
            const res = await response.json();
            // threadId, title
            const filteredData = res.map(thread =>({threadId: thread.threadId, title: thread.title}));
            setAllThreads(filteredData);

        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getAllThreads();
    }, [currThreadId])  //whenever chat changes, call getallthreads

    const createNewChat = ()=>{
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(uuidv4());
        setPrevChats([]);
    }

    const changeThread = async (newThreadId)=>{
        setCurrThreadId(newThreadId);
        try{
            const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        }catch(err){
            console.log(err);
        }
    }
    
    const deleteThread = async (threadId)=>{
        try{
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            // updated threads re-render .....react automatically passes the prev state value to the callback function ~ prev 
            setAllThreads(prev => prev.filter(thread => thread.threadId != threadId));

            //if we are at current chat and delete the same chat then we dont want it to display on our chat window so create new one
            if(threadId == currThreadId){
                createNewChat();
            }
        }catch(err){
            console.log(err);
        }
    }

    return (
       <section className="sidebar">
        {/* new chat button */}
        <img src={logo} alt="" className="logo"/>
        <button onClick={createNewChat}>
            
              <i className="fa-regular fa-pen-to-square"></i> 
              <span>New Chat</span>
            
        </button>

  
        

        {/* history */}
        <ul className="history">
          <p style={{fontSize : "0.8rem"}}> <b>Recents</b> </p>
           {
           allThreads?.map((thread, idx)=> (
            <li onClick={() => {changeThread(thread.threadId)}} key ={idx}>{thread.title} <i className="fa-solid fa-trash" onClick={(event) => {event.stopPropagation(); deleteThread(thread.threadId)}}></i></li>
           ))
           }
        </ul>

        {/* extra btns */}
        <div className="sign">
        <p>By ConvoAI &hearts;</p>
        </div>
       </section>
    )
}
export default Sidebar