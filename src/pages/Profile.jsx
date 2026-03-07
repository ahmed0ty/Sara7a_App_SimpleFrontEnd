import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../api/api"
import { QRCodeCanvas } from "qrcode.react"
import "./profile.css"

export default function Profile(){

const [user,setUser]=useState(null)
const [messages,setMessages]=useState([])
const [copied,setCopied]=useState(false)

const navigate = useNavigate()

useEffect(()=>{

const getProfileAndMessages = async ()=>{

try{

const token = localStorage.getItem("token")



const {data} = await API.get("/user/getprofile",{
headers:{ Authorization:`Bearer ${token}` }
})

const userData = data.data.user

setUser(userData)



const messagesRes = await API.get(`/messages/${userData._id}/get-messages`)

setMessages(messagesRes.data.data.messages)

}catch(err){
console.log(err.response?.data || err.message)
}

}

getProfileAndMessages()

},[])

if(!user){

return(
<div className="profile-loading">
<div className="spinner"></div>
</div>
)

}

const link=`${window.location.origin}/send/${user._id}`

const copyLink=()=>{
navigator.clipboard.writeText(link)
setCopied(true)

setTimeout(()=>{
setCopied(false)
},2000)
}

const logout=()=>{
localStorage.removeItem("token")
navigate("/login")
}


const deleteMessage = async(id)=>{

try{

const token = localStorage.getItem("token")

await API.delete(`/messages/${id}/delete-message`,{
headers:{ Authorization:`Bearer ${token}` }
})

setMessages(messages.filter(msg=>msg._id!==id))

}catch(err){
console.log(err)
}

}

return(

<div className="dashboard">

<div className="profile-card">

<h1>Sara7a</h1>

<div className="avatar">
{user.name?.charAt(0).toUpperCase()}
</div>

<h2>{user.name}</h2>
<p className="email">{user.email}</p>

<div className="link-section">

<h3>Your Sara7a Link</h3>

<div className="link-box">

<input value={link} readOnly/>

<button onClick={copyLink}>
Copy
</button>

</div>

{copied && <p className="success">Link Copied ✅</p>}

<div className="qr">
<QRCodeCanvas value={link} size={120}/>
</div>

</div>

<button className="logout-btn" onClick={logout}>
Logout
</button>

</div>


<div className="messages-card">

<h2>Messages ({messages.length})</h2>

{messages.length === 0 && (
<p className="no-msg">No messages yet</p>
)}



</div>

</div>

)

}