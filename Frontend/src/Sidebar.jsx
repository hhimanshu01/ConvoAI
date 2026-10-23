import "./Sidebar.css";
import {MyContext} from "./MyContext.jsx"
import { useContext, useEffect} from "react";
import {v4 as uuidv4} from "uuid"

function Sidebar(){
   return(
    <section className="sidebar">
        {/* new chat button */}
        <button >
            <span><i className="fa-brands fa-openai"></i></span>
            <span><i className="fa-regular fa-pen-to-square"></i></span>
        </button>

        {/* history */}
        <ul className="history">
          <li>kjvb</li>
          <li>kjvb</li>
          <li>kjvb</li>
        </ul>

        {/* extra btns */}
        <div className="sign">
        <p>By AskAI &hearts;</p>
        </div>
       </section>
   )
}
export default Sidebar