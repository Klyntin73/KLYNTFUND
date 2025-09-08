import React, { useContext, useEffect, useState } from 'react';
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Register = () => {
   const [showPassword, setShowPassword] = useState(false);
   const [role, setRole] = useState('creator');
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirmPassword, setConfirmPassword] = useState('');
   const [fullName, setFullName] = useState('');
   const { token, setToken, setUserData, backendUrl } = useContext(AppContext);
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);


   // Form handler
   const submitHandler = async (e) => {
      e.preventDefault();

      if (!fullName || !email || !password || !confirmPassword) {
         toast.warn("Please fill all fields");
         return;
      }
      if (password !== confirmPassword) {
         toast.warn("Passwords do not match");
         return;
      }

      try {
         setLoading(true);
         const { data } = await axios.post(`${backendUrl}/api/user/register`, { fullName, email, password, role });

         if (data.success) {
            localStorage.setItem("token", data.token);
            setToken(data.token);
            setUserData(data.userData);
         } else {
            toast.error(data.message);
         }

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      if (token) {
         navigate('/login');
      }
   }, [token, navigate]);

   return (
      <motion.div
         initial={ { opacity: 0, y: 40 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.6 } }
         className="min-h-screen flex flex-col md:flex-row">

         {/* Header / Banner */ }
         <div className="bg-[#0F172A] text-white md:w-1/2 p-10 flex flex-col justify-center items-start">
            <div>
               <h1 className="text-3xl md:text-4xl font-bold mb-4">Join <span className="text-[#FACC15]">KLYNTFUND</span></h1>
               <p className="text-gray-300 max-w-md">
                  Empower your ideas or fund the future. Sign up as a Creator or Investor to get started.
               </p>
            </div>
         </div>

         {/* Register Form */ }
         <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
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
                  onClick={ () => setRole('investor') }
                  className={ `px-4 py-2 rounded-full text-sm font-medium cursor-pointer ${role === 'investor' ? 'bg-[#0F172A] text-white' : 'bg-gray-100 text-gray-600'
                     }` }
               >
                  Investor
               </button>
            </div>

            <form className="space-y-5" onSubmit={ submitHandler }>
               <div className="relative">
                  <FaUser className="absolute top-3 left-3 text-gray-400" />
                  <input
                     type="text"
                     placeholder="Full Name"
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                     onChange={ (e) => setFullName(e.target.value) }
                     value={ fullName }
                  />
               </div>

               <div className="relative">
                  <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
                  <input
                     type="email"
                     placeholder="Email Address"
                     className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                     onChange={ (e) => setEmail(e.target.value) }
                     value={ email }
                  />
               </div>

               <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                     type={ showPassword ? 'text' : 'password' }
                     placeholder="Password"
                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                     onChange={ (e) => setPassword(e.target.value) }
                     value={ password }
                  />
                  <span
                     className="absolute right-3 top-3 cursor-pointer text-gray-400"
                     onClick={ () => setShowPassword(!showPassword) }
                  >
                     { showPassword ? <FaEyeSlash /> : <FaEye /> }
                  </span>
               </div>

               <div className="relative">
                  <FaLock className="absolute top-3 left-3 text-gray-400" />
                  <input
                     type={ showPassword ? 'text' : 'password' }
                     placeholder="Confirm Password"
                     className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0F172A]"
                     onChange={ (e) => setConfirmPassword(e.target.value) }
                     value={ confirmPassword }
                  />
               </div>

               <button
                  type="submit"
                  className={ `w-full bg-[#FACC15] hover:bg-yellow-400 text-[#0F172A] py-2 rounded font-semibold cursor-pointer ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-400'
                     }` }
               >
                  { loading ? 'Signing up...' : 'Sign Up' }
               </button>

               <button
                  type="button"
                  className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded font-medium flex items-center justify-center gap-3"
               >
                  <FcGoogle className="text-xl" />
                  Sign Up with Google
               </button>
            </form>

            <div className="text-sm text-gray-600 text-center mt-6">
               Already have an account?{ ' ' }
               <Link to="/login" className="text-[#0F172A] font-medium hover:underline" onClick={ () => scrollTo(0, 0) }>
                  Login here
               </Link>
            </div>
         </div>
      </motion.div>
   );
};

export default Register;
