import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", username: "", password: "" });
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Logging in with:", form);
        navigate("/");
    };
    
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-slate-800 to-slate-900 p-6">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-[#0b0f35] p-8 rounded-xl shadow-2xl w-full max-w-md relative"
            >
                <button 
                    className="absolute top-4 left-4 text-red-500 hover:text-red-400 transition"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-3xl font-normal text-white text-center mb-6 tracking-tight leading-relaxed">
                    Login Please 🚀
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={form.email} 
                        onChange={handleChange} 
                        className="p-3 rounded-lg bg-slate-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        required 
                    />
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={form.username} 
                        onChange={handleChange} 
                        className="p-3 rounded-lg bg-slate-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        required 
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password" 
                        value={form.password} 
                        onChange={handleChange} 
                        className="p-3 rounded-lg bg-slate-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                        required 
                    />
                    <motion.button 
                        type="submit" 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition font-semibold tracking-wide">
                        Login
                    </motion.button>
                </form>
                <p className="text-gray-400 text-sm text-center mt-4">
                    Don't have an account? 
                    <span 
                        className="text-blue-400 cursor-pointer hover:text-blue-300 transition font-semibold" 
                        onClick={() => navigate("/signup")}
                    > Sign Up
                    </span>
                </p>
            </motion.div>
        </div>
    );
}