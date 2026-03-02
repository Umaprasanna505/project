import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [data, setData] = useState({});

  const register = async () => {
    await axios.post("http://localhost:5000/api/auth/register", data);
    alert("Registered");
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="name" onChange={e=>setData({...data,name:e.target.value})} />
      <input placeholder="email" onChange={e=>setData({...data,email:e.target.value})} />
      <input placeholder="password" onChange={e=>setData({...data,password:e.target.value})} />
      <button onClick={register}>Register</button>
    </div>
  );
}