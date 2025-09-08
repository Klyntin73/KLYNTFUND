import React, { useContext, useState } from 'react';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Login = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [role, setRole] = useState('creator');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const { setToken, setUserData, backendUrl } = useContext(AppContext);
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);


   // Form handler
   const submitHandler = async (e) => {
      e.preventDefault();
      if (!email || !password) {
         toast.warn("Please fill all fields");
         return;
      }

      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password, role });

         if (data.success) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUserData(data.userData);
            if (data.userData?.role === 'creator') {
               navigate('/creator/dashboard');
            } else if (data.userData?.role === 'investor') {
               navigate('/investor/dashboard');
            } else {
               navigate('/');
            }

         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };


   return (
      <motion.div
         initial={ { opacity: 0, y: 40 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.6 } }
         className="min-h-screen flex flex-col md:flex-row"
      >
         {/* Header Section */ }
         <div className="md:w-1/2 bg-[#0F172A] text-white flex items-center justify-center p-10">
            <div>
               <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome Back to <span className="text-[#FACC15]">KLYNTFUND</span></h1>
               <p className="text-gray-300 max-w-md">
                  Join Ghana’s top innovators and investors driving real-world impact.
               </p>
            </div>
         </div>

         {/* Form Section */ }
         <div className="md:w-1/2 flex items-center justify-center p-8 bg-white">
            <div className="w-full max-w-md space-y-6">
               {/* Role Toggle */ }
               <div className="flex justify-between mb-6">
                  <button
                     className={ `px-4 py-2 text-sm font-medium rounded-full cursor-pointer ${role === 'creator'
                        ? 'bg-[#0F172A] text-white'
                        : 'bg-gray-100 text-gray-700'
                        }` }
                     onClick={ () => setRole('creator') }
                  >
                     Creator Login
                  </button>
                  <button
                     className={ `px-4 py-2 text-sm font-medium rounded-full cursor-pointer ${role === 'investor'
                        ? 'bg-[#0F172A] text-white'
                        : 'bg-gray-100 text-gray-700'
                        }` }
                     onClick={ () => setRole('investor') }
                  >
                     Investor Login
                  </button>

               </div>

               {/* Login Form */ }
               <form className="space-y-4" onSubmit={ submitHandler }>
                  <div className="relative">
                     <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                     <input
                        type="email"
                        placeholder="Email Address"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                        onChange={ (e) => setEmail(e.target.value) }
                        value={ email }
                     />
                  </div>

                  <div className="relative">
                     <FaLock className="absolute left-3 top-3 text-gray-400" />
                     <input
                        type={ showPassword ? 'text' : 'password' }
                        placeholder="Password"
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                        onChange={ (e) => setPassword(e.target.value) }
                        value={ password }
                     />
                     <div
                        onClick={ () => setShowPassword(!showPassword) }
                        className="absolute right-3 top-3 text-gray-400 cursor-pointer"
                     >
                        { showPassword ? <FaEyeSlash /> : <FaEye /> }
                     </div>
                  </div>

                  <div className="flex justify-between items-center text-sm text-gray-600">
                     <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        Remember me
                     </label>
                     <Link to="/forgot-password" className="text-[#0F172A] hover:underline">
                        Forgot password?
                     </Link>
                  </div>

                  <button
                     type="submit"
                     className={ `w-full bg-[#FACC15] hover:bg-yellow-400 text-[#0F172A] py-2 rounded font-semibold cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-400'
                        }` }
                  >
                     { loading ? 'Signing in...' : 'Login' }
                  </button>

                  {/* Optional Social Login */ }
                  <button
                     type="button"
                     className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded font-medium flex items-center justify-center gap-3 cursor-pointer"
                  >
                     <FcGoogle className="text-xl" />
                     Login with Google
                  </button>
               </form>

               {/* Redirect */ }
               <div className="text-sm text-gray-600 text-center">
                  Don’t have an account?{ ' ' }
                  <Link to="/register" className="text-[#0F172A] hover:underline" onClick={ () => scrollTo(0, 0) }>
                     Sign up
                  </Link>
               </div>
            </div>
         </div>
      </motion.div>
   );
};

export default Login;
