import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { Lock, Mail, Loader } from 'lucide-react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';

const Login = () => {
   const { backendUrl, setAdminToken } = useContext(AdminContext);
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleLogin = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
            email,
            password,
         });
         if (data.success) {
            localStorage.setItem('adminToken', data.token);
            setAdminToken(data.token);
            navigate('/admin/dashboard');
         } else {
            toast.error(data.message || 'Login failed');
         }
      } catch (err) {
         toast.error(err.response?.data?.message || 'Login failed');
         console.error('Login error:', err);
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
         <motion.div
            initial={ { opacity: 0, scale: 0.95, y: 30 } }
            animate={ { opacity: 1, scale: 1, y: 0 } }
            transition={ { duration: 0.5, ease: 'easeOut' } }
            className="bg-slate-50 border border-gray-200 shadow-lg p-8 rounded-xl w-full max-w-md space-y-6"
         >
            <div className="text-center">
               <h2 className="text-2xl font-bold text-[#2C3E50] mb-1">Welcome Back, Admin</h2>
               <p className="text-sm text-[#555]">Login to manage projects and users securely.</p>
            </div>

            <form onSubmit={ handleLogin } className="space-y-5">
               <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={ 18 } />
                  <input
                     type="email"
                     placeholder="Email"
                     className="pl-10 w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                     value={ email }
                     onChange={ (e) => setEmail(e.target.value) }
                     required
                  />
               </div>

               <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={ 18 } />
                  <input
                     type="password"
                     placeholder="Password"
                     className="pl-10 w-full py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                     value={ password }
                     onChange={ (e) => setPassword(e.target.value) }
                     required
                  />
               </div>

               <button
                  type="submit"
                  disabled={ loading }
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-md bg-[#FACC15] hover:bg-yellow-400 text-[#0F172A] font-medium transition disabled:opacity-50"
               >
                  { loading ? <Loader className="animate-spin w-5 h-5 text-white" /> : 'Login' }
               </button>
            </form>
         </motion.div>
      </div>
   );
};

export default Login;
