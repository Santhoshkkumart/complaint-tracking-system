import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";

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
  const { user, isAdmin, loading } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      if (isAdmin) {
        navigate("/dashboard");
      } else {
        navigate("/user-dashboard");
      }
    }
  }, [user, isAdmin, loading, navigate]);

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isSignup && role === "user") {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("User account created ");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      alert(err.message);
      console.log(err);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-x-hidden overflow-y-auto px-4 py-6 text-white sm:py-8">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative z-10 mx-auto w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-2 mb-6 sm:mb-8"
        >
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-200 drop-shadow-md">
            ResolveX
          </h1>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm font-medium max-w-xs mx-auto drop-shadow-md">
            The future of complaint management
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl sm:p-6"
        >
          {/* Subtle line at the top */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

          <div className="mb-4 sm:mb-6 text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-1">Welcome Back</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Select your role and sign in</p>
          </div>

          <div className="grid grid-cols-2 p-1 bg-black/20 rounded-xl border border-white/10 mb-5 sm:mb-6">
            <button
              type="button"
              onClick={() => setRole("user")}
              className={`relative py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-2 transition-colors ${role === "user" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              {role === "user" && (
                <motion.span
                  layoutId="role-pill"
                  className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-lg shadow-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <User size={14} /> User
              </span>
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`relative py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold flex items-center justify-center gap-2 transition-colors ${role === "admin" ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
            >
              {role === "admin" && (
                <motion.span
                  layoutId="role-pill"
                  className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-lg shadow-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <ShieldCheck size={14} /> Admin
              </span>
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl bg-black/20 border border-white/10 focus:border-white/50 focus:bg-white/5 outline-none transition-all placeholder:text-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur-md"
                  value={email}
                  maxLength={EMAIL_MAX_CHARS}
                  onKeyDown={(e) => {
                    if (e.key === " ") e.preventDefault();
                  }}
                  onChange={(e) => setEmail(sanitizeEmailInput(e.target.value))}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/70 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-white/50">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-2.5 sm:py-3 rounded-xl bg-black/20 border border-white/10 focus:border-white/50 focus:bg-white/5 outline-none transition-all placeholder:text-white/30 text-white font-semibold text-sm sm:text-base backdrop-blur-md"
                  value={password}
                  maxLength={PASSWORD_MAX_CHARS}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-4 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-[10px] font-bold text-white/70 hover:text-white transition-colors">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full mt-2 bg-white/10 hover:bg-white/20 text-white border-white/20 shadow-lg text-base sm:text-lg font-black py-6 sm:py-7"
            >
              {isSignup && role === "user" ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <AnimatePresence mode="wait">
            {role === "user" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-xs text-white/70 mt-6"
              >
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setIsSignup(!isSignup)}
                  className="text-white font-bold hover:underline"
                >
                  {isSignup ? "Log In" : "Register Now"}
                </button>
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <p className="mt-6 text-white/50 text-[10px] font-medium uppercase tracking-[0.2em] text-center drop-shadow-md">
          © 2026 ResolveX Ecosystem
        </p>
      </div>
    </div>
  );
}

export default Login;
