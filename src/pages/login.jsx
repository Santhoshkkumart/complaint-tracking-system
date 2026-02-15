import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../services/firebase.js"
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] via-[#020617] to-[#0f172a]">

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.15),transparent_60%)]"></div>

  <div className="relative w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8">

```
{/* Logo / Title */}
<div className="text-center mb-8">
  <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
    Complaint Portal
  </h1>
  <p className="text-slate-400 text-sm mt-2">
    Secure admin & user login
  </p>
</div>

{/* Email */}
<div className="mb-4">
  <label className="text-sm text-slate-400">Email</label>
  <input
    type="email"
    placeholder="Enter your email"
    onChange={(e) => setEmail(e.target.value)}
    className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder:text-slate-500 transition"
  />
</div>

{/* Password */}
<div className="mb-6">
  <label className="text-sm text-slate-400">Password</label>
  <input
    type="password"
    placeholder="Enter your password"
    onChange={(e) => setPassword(e.target.value)}
    className="w-full mt-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 outline-none text-white placeholder:text-slate-500 transition"
  />
</div>

{/* Button */}
<button
  onClick={handleLogin}
  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
>
  Login to Dashboard
</button>

```

  </div>
</div>
  );
}

export default Login;
