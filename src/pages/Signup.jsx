import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useEffect } from "react"
import API from "../api/api"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./signup.css"

const schema = z.object({

firstName:z.string()
.min(3,"First name must be at least 3 characters")
.max(20,"Max 20 characters")
.regex(/^[A-Za-z]+$/,"Letters only"),

lastName:z.string()
.min(3,"Last name must be at least 3 characters")
.max(20,"Max 20 characters")
.regex(/^[A-Za-z]+$/,"Letters only"),

email:z.string().email("Invalid email"),

password:z.string().min(8,"Password must be at least 8 characters"),

phone:z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/,"Invalid Egyptian phone"),

gender:z.string().min(1,"Gender required")

})

export default function Signup(){

const navigate = useNavigate()

const [loading,setLoading] = useState(false)
const [showPassword,setShowPassword] = useState(false)
const [strength,setStrength] = useState("")

const {
register,
handleSubmit,
watch,
formState:{errors}
} = useForm({
resolver:zodResolver(schema),
mode:"onChange"
})

const password = watch("password")

useEffect(()=>{
checkStrength(password || "")
},[password])

const checkStrength = (password)=>{

if(!password){
setStrength("")
return
}

let score = 0

if(password.length >= 8) score++
if(/[A-Z]/.test(password)) score++
if(/[a-z]/.test(password)) score++
if(/[0-9]/.test(password)) score++
if(/[^A-Za-z0-9]/.test(password)) score++

if(score <= 2){
setStrength("weak")
}
else if(score <= 4){
setStrength("medium")
}
else{
setStrength("strong")
}

}

const onSubmit = async(data)=>{

try{

setLoading(true)

await API.post("/auth/signup",{...data,role:"USER"})

toast.success("Account created, check your email")

setTimeout(()=>{
navigate("/confirm-email")
},1500)

}catch(err){

toast.error(err.response?.data?.message || "Signup failed")

}finally{

setLoading(false)

}

}

return(

<div className="signup-page">

<ToastContainer/>

<div className="signup-card">

<h1>Sara7a</h1>
<h3>Create Account</h3>

<form onSubmit={handleSubmit(onSubmit)}>

<div className="row">

<div className="input-group">

<input
placeholder="First Name"
{...register("firstName")}
onKeyDown={(e)=>{
if(!/^[a-zA-Z]$/.test(e.key) && e.key !== "Backspace"){
e.preventDefault()
}
}}
/>

{!errors.firstName && watch("firstName") &&
<span className="success">✔</span>}

{errors.firstName && (
<span className="error">{errors.firstName.message}</span>
)}

</div>

<div className="input-group">

<input
placeholder="Last Name"
{...register("lastName")}
onKeyDown={(e)=>{
if(!/^[a-zA-Z]$/.test(e.key) && e.key !== "Backspace"){
e.preventDefault()
}
}}
/>

{!errors.lastName && watch("lastName") &&
<span className="success">✔</span>}

{errors.lastName && (
<span className="error">{errors.lastName.message}</span>
)}

</div>

</div>

<div className="input-group">

<input
placeholder="Email"
{...register("email")}
/>

{!errors.email && watch("email") &&
<span className="success">✔</span>}

{errors.email && (
<span className="error">{errors.email.message}</span>
)}

</div>

<div className="input-group password-field">

<input
type={showPassword ? "text":"password"}
placeholder="Password"
{...register("password")}
/>

<span
className="eye"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈":"👁"}
</span>

{errors.password && (
<span className="error">{errors.password.message}</span>
)}

{password && (

<div className={`strength-bar ${strength}`}>
<span></span>
</div>

)}

</div>

<div className="input-group">

<input
placeholder="Phone"
{...register("phone")}
/>

{!errors.phone && watch("phone") &&
<span className="success">✔</span>}

{errors.phone && (
<span className="error">{errors.phone.message}</span>
)}

</div>

<div className="input-group">

<select {...register("gender")}>

<option value="">Select Gender</option>
<option value="male">Male</option>
<option value="female">Female</option>

</select>

{errors.gender && (
<span className="error">{errors.gender.message}</span>
)}

</div>

<button className="signup-btn" disabled={loading}>

{loading ? "Creating..." : "Sign Up"}

</button>

</form>

<p>
Already have an account? <Link to="/login">Login</Link>
</p>

</div>

</div>

)

}