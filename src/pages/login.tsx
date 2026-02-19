import { useState } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import RocketModel from "../components/RocketModel";

const sanitizeEmailInput = (value: string) =>
  value.replace(/[^a-zA-Z0-9@._-]/g, "").toLowerCase();
const EMAIL_MAX_CHARS = 254;
const PASSWORD_MAX_CHARS = 64;

function Login() {
  const [role, setRole] = useState("user");
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const ADMIN_EMAILS = ["santhoshkkumarsan@gmail.com"];

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignup && role === "user") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("User account created 🎉");
        navigate("/user-dashboard");
      } else {
        if (role === "admin" && !ADMIN_EMAILS.includes(email)) {
          alert("Only admin accounts can log in with the Admin role.");
          return;
        }

        await signInWithEmailAndPassword(auth, email, password);
        const isAdminEmail = ADMIN_EMAILS.includes(email);

        if (isAdminEmail) {
          alert("Admin login successful 🔥");
          navigate("/dashboard");
        } else {
          alert("User login successful 🔥");
          navigate("/user-dashboard");
        }
      }
    } catch (err: any) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white relative overflow-hidden px-4 py-8">
      <RocketModel />
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          Smart Complaint Management System
        </h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Resolve issues faster & smarter 🚀
        </p>
      </div>

      <div className="w-full max-w-md bg-[#0b1220] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">

        <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
        <p className="text-slate-400 text-sm mb-6">
          Sign in to manage complaints
        </p>

        <div className="flex bg-[#020617] rounded-lg overflow-hidden mb-5 border border-white/10">
          <button
            onClick={() => setRole("user")}
            className={`w-1/2 py-2 ${role === "user" ? "bg-cyan-600" : ""}`}
          >
            User
          </button>
          <button
            onClick={() => setRole("admin")}
            className={`w-1/2 py-2 ${role === "admin" ? "bg-cyan-600" : ""}`}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="text-sm text-slate-400">Email</label>
            <input
              type="email"
              placeholder="admin@complainttrack.com"
              className="w-full mt-1 p-3 rounded-lg bg-[#020617] border border-white/10 focus:border-cyan-500 outline-none"
              value={email}
              maxLength={EMAIL_MAX_CHARS}
              onKeyDown={(e) => {
                if (e.key === " ") {
                  e.preventDefault();
                }
              }}
              onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
            />
          </div>

          <div>
            <label className="text-sm text-slate-400">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full p-3 pr-11 rounded-lg bg-[#020617] border border-white/10 focus:border-cyan-500 outline-none"
                value={password}
                maxLength={PASSWORD_MAX_CHARS}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 px-3 text-slate-400 hover:text-cyan-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end items-center text-sm mt-2">
            <span className="text-orange-400 cursor-pointer">
              Forgot password?
            </span>
          </div>

          <button className="w-full mt-4 bg-orange-500 hover:bg-orange-600 transition p-3 rounded-xl font-semibold text-black">
            {isSignup && role === "user" ? "Create Account" : "Sign In"}
          </button>
        </form>

        {role === "user" && (
          <p
            className="text-center text-sm text-slate-400 mt-6 cursor-pointer"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Request access"}
          </p>
        )}

      </div>
    </div>
  );
}

export default Login;
