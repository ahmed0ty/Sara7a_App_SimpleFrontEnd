
import { Link } from "react-router-dom";

export default function Navbar(){

  const logout=()=>{
    localStorage.removeItem("token");
    window.location="/login";
  }

  return(
    <div className="nav">
      <div>Sara7a</div>
      <div>
        <Link to="/profile" style={{color:"white",marginRight:15}}>Profile</Link>
        <Link to="/inbox" style={{color:"white",marginRight:15}}>Inbox</Link>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
