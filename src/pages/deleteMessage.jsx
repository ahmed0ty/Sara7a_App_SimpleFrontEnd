import axios from "axios";
import { useEffect, useState } from "react";

export default function Messages() {

  const [messages,setMessages] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    getMessages();
  },[])


  const getMessages = async ()=>{

    try{

      const res = await axios.get(
        `https://sara7a-application.onrender.com/api/messages/${userId}/get-messages`
      );

      setMessages(res.data.data.messages);

    }catch(err){
      console.log(err);
    }

  }


const deleteMessage = async (messageId)=>{

try{

const token = localStorage.getItem("token");

console.log("TOKEN:",token)

const res = await axios.delete(
`https://sara7a-application.onrender.com/api/messages/${messageId}/delete-message`,
{
headers:{
Authorization:`Bearer ${token}`
}
}
)

console.log(res.data)

setMessages(prev =>
prev.filter(msg => msg._id !== messageId)
)

}catch(err){
console.log(err.response?.data || err)
}

}


  return (

    <div>

      <h2>Messages</h2>

      {messages.map(msg => (

        <div key={msg._id} className="messageCard">

          <p>{msg.content}</p>

          {msg.attachments?.map((img,i)=>(
            <img key={i} src={img.secure_url} width="200"/>
          ))}

<button onClick={()=>{
console.log("delete clicked")
deleteMessage(msg._id)
}}>
Delete
</button>

        </div>

      ))}

    </div>

  )

}

