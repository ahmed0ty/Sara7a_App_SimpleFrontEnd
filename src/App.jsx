import { Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import Inbox from "./pages/Inbox"
import SendMessage from "./pages/SendMessage"
import ConfirmEmail from "./pages/ConfirmEmail"
export default function App(){

  return(
    <Routes>

      <Route path="/" element={<Navigate to="/login"/>}/>

      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/inbox" element={<Inbox/>}/>
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/send/:id" element={<SendMessage/>}/>

    </Routes>
  )
}