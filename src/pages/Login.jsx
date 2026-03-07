import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../api/api"
import "./login.css"

export default function Login(){

const navigate = useNavigate()

const [form,setForm]=useState({
email:"",
password:""
})

const [errors,setErrors]=useState({})
const [success,setSuccess]=useState("")
const [loading,setLoading]=useState(false)
const [showPassword,setShowPassword]=useState(false)

const change=(e)=>{
const {name,value}=e.target

setForm({...form,[name]:value})

validate(name,value)
}

// validation
const validate=(name,value)=>{

let newErrors={...errors}

if(name==="email"){
const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
if(!regex.test(value)){
newErrors.email="Please enter a valid email"
}else{
delete newErrors.email
}
}

if(name==="password"){
if(value.length<6){
newErrors.password="Password must be at least 6 characters"
}else{
delete newErrors.password
}
}

setErrors(newErrors)
}

const submit=async(e)=>{
e.preventDefault()

if(!form.email || !form.password){
setErrors({
email:!form.email ? "Email is required" : "",
password:!form.password ? "Password is required" : ""
})
return
}

try{

setLoading(true)

const {data}=await API.post("/auth/login",form)

localStorage.setItem(
"token",
data.data.newCredentials.accesstoken
)

setSuccess("Login successful 🎉")

setTimeout(()=>{
navigate("/profile")
},1500)

}catch(err){

setErrors({
server:err.response?.data?.message || "Login failed"
})

}finally{
setLoading(false)
}

}

return(

<div className="login-page">

<div className="login-card">

<h1>Sara7a</h1>
<h3>Welcome Back</h3>

<form onSubmit={submit}>

<input
name="email"
placeholder="Email"
value={form.email}
onChange={change}
className={errors.email ? "error-input":""}
/>

{errors.email && <p className="error-text">{errors.email}</p>}

<div className="password-box">

<input
type={showPassword ? "text":"password"}
name="password"
placeholder="Password"
value={form.password}
onChange={change}
className={errors.password ? "error-input":""}
/>

<span
className="show-pass"
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword ? "🙈" : "👁️"}
</span>

</div>

{errors.password && <p className="error-text">{errors.password}</p>}

{errors.server && <p className="error-text">{errors.server}</p>}

{success && <p className="success-text">{success}</p>}

<button
className="login-btn"
type="submit"
disabled={loading}
>

{loading ? <div className="spinner"></div> : "Login"}

</button>

</form>

<p>
Don't have an account?{" "}
<Link to="/signup">Sign Up</Link>
</p>

</div>

</div>

)

}