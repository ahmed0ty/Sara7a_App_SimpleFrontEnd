import { useEffect, useState } from "react"
import API from "../api/api"
import { jwtDecode } from "jwt-decode"
import "./inbox.css"

export default function Inbox(){

const [messages,setMessages] = useState([])
const [loading,setLoading] = useState(true)
const [copiedId,setCopiedId] = useState(null)
const [deletingId,setDeletingId] = useState(null)

useEffect(()=>{

const getMessages = async ()=>{

try{

const token = localStorage.getItem("token")
const decoded = jwtDecode(token)

const {data} = await API.get(`/messages/${decoded._id}/get-messages`)

const msgs = data.data.messages.map(m => ({
...m,
liked:false
}))

setMessages(msgs)

}catch(err){
console.log(err)
}finally{
setLoading(false)
}

}

getMessages()

},[])



/* DELETE MESSAGE FROM DATABASE */

const deleteMessage = async (id)=>{

try{

setDeletingId(id)

const token = localStorage.getItem("token")

await API.delete(`/messages/${id}/delete-message`,{
headers:{
Authorization:`Bearer ${token}`
}
})

setTimeout(()=>{

setMessages(prev =>
prev.filter(m => m._id !== id)
)

},300)

}catch(err){
console.log(err)
}

}



/* LIKE MESSAGE */

const likeMessage = (id)=>{

setMessages(messages.map(m =>
m._id === id ? {...m,liked:!m.liked} : m
))

}



/* COPY MESSAGE */

const copyMessage = (text,id)=>{

navigator.clipboard.writeText(text)

setCopiedId(id)

setTimeout(()=>{
setCopiedId(null)
},1500)

}



if(loading){

return(

<div className="inboxLoading">
<div className="spinner"></div>
</div>

)

}



return(

<div className="inboxPage">

<div className="inboxContainer">

<h2>Your Messages ({messages.length})</h2>

{messages.length === 0 ? (

<div className="emptyBox">

<h3>No messages yet</h3>
<p>Share your Sara7a link to receive messages</p>

</div>

):(


messages.map(msg=>(

<div
key={msg._id}
className={`messageCard ${deletingId === msg._id ? "deleteAnim" : ""}`}
>

<p>{msg.content}</p>

<div className="actions">

<button
className={msg.liked ? "liked" : ""}
onClick={()=>likeMessage(msg._id)}
>
❤️
</button>

<button
onClick={()=>copyMessage(msg.content,msg._id)}
>
{copiedId === msg._id ? "✔ Copied" : "📋 Copy"}
</button>

<button
className="deleteBtn"
onClick={()=>deleteMessage(msg._id)}
>
🗑 Delete
</button>

</div>

<span className="date">
{new Date(msg.createdAt).toLocaleDateString()}
</span>

</div>

))

)}

</div>

</div>

)

}