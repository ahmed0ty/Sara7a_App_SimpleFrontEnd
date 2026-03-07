import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./confirm.css";

function ConfirmEmail() {

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [otp,setOtp] = useState(["","","","","",""])
const [loading,setLoading] = useState(false)

const [emailError,setEmailError] = useState("")
const [otpError,setOtpError] = useState("")
const [success,setSuccess] = useState("")

// email validation
const validateEmail = (value)=>{
const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

if(!regex.test(value)){
setEmailError("Please enter a valid email")
}else{
setEmailError("")
}
}

// otp input
const handleOtpChange = (element,index)=>{

const value = element.value

if(isNaN(value)) return

let newOtp = [...otp]
newOtp[index] = value
setOtp(newOtp)

if(value && element.nextSibling){
element.nextSibling.focus()
}

}

// backspace
const handleKeyDown = (e,index)=>{
if(e.key === "Backspace" && !otp[index] && e.target.previousSibling){
e.target.previousSibling.focus()
}
}

const handleConfirm = async ()=>{

const finalOtp = otp.join("")

if(!email){
setEmailError("Email is required")
return
}

if(finalOtp.length < 6){
setOtpError("OTP must be 6 digits")
return
}

try{

setLoading(true)

await axios.patch(
"https://sara7a-application.onrender.com/api/auth/confirm-email",
{
email,
otp:finalOtp
}
)

setSuccess("Email verified successfully 🎉")

setTimeout(()=>{
navigate("/login")
},2000)

}catch(err){

setOtpError(
err.response?.data?.message || "Invalid or expired code"
)

}finally{
setLoading(false)
}

}

return(

<div className="confirm-page">

<div className="confirm-card">

<h1>Sara7a</h1>

<h3>Confirm your email</h3>

<p>Enter the code sent to your email</p>

<input
className={`email-input ${emailError && "error"}`}
placeholder="Enter your email"
value={email}
onChange={(e)=>{
setEmail(e.target.value)
validateEmail(e.target.value)
}}
/>

{emailError && <p className="error-text">{emailError}</p>}

<div className="otp-container">

{otp.map((data,index)=>{

return(

<input
key={index}
type="text"
maxLength="1"
value={data}
onChange={(e)=>handleOtpChange(e.target,index)}
onKeyDown={(e)=>handleKeyDown(e,index)}
className="otp-input"
/>

)

})}

</div>

{otpError && <p className="error-text">{otpError}</p>}

{success && <p className="success-text">{success}</p>}

<button onClick={handleConfirm} disabled={loading}>

{loading ? <div className="spinner"></div> : "Confirm Email"}

</button>

</div>

</div>

)

}

export default ConfirmEmail