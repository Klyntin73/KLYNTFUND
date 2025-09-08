import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
   User, Mail, Calendar, ArrowLeft, Loader, MapPin, Info, Twitter,
   Linkedin, Trash2, MessageSquare, Ban, CheckCircle
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import MessageModal from "./MessageModal";


const UserProfile = () => {
   const { id } = useParams();
   const { backendUrl, adminToken } = useContext(AdminContext);
   const navigate = useNavigate();

   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   // modal state
   const [isMessageOpen, setIsMessageOpen] = useState(false);

   // Fetch user
   useEffect(() => {
      const fetchUser = async () => {
         try {
            const { data } = await axios.get(
               `${backendUrl}/api/admin/users/profile/${id}`,
               { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            setUser(data.data);
         } catch (error) {
            console.error("Error fetching user:", error);
            toast.error(error.response?.data?.message || "Failed to fetch user profile.");
         } finally {
            setLoading(false);
         }
      };

      fetchUser();
   }, [id, backendUrl, adminToken]);

   // Send Message (called when modal submits)
   const handleSendMessage = async (message) => {
      try {
         await axios.post(
            `${backendUrl}/api/admin/users/${id}/message`,
            { message },
            { headers: { Authorization: `Bearer ${adminToken}` } }
         );
         toast.success("Message sent successfully (simulation).");
      } catch (error) {
         console.error("Error messaging user:", error);
         toast.error(error.response?.data?.message || "Failed to send message.");
      }
   };

   // Suspend / Reactivate
   const handleSuspend = async () => {
      try {
         const { data } = await axios.patch(
            `${backendUrl}/api/admin/users/${id}/suspend`,
            {},
            { headers: { Authorization: `Bearer ${adminToken}` } }
         );
         toast.info(data.message);
         setUser(data.data); // update state with toggled suspend status
      } catch (error) {
         console.error("Error suspending user:", error);
         toast.error(error.response?.data?.message || "Failed to update suspension status.");
      }
   };

   // Delete
   const handleDelete = async () => {
      if (!window.confirm("Are you sure you want to delete this user?")) return;

      try {
         await axios.delete(`${backendUrl}/api/admin/users/delete/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         toast.success("User deleted successfully");
         navigate(-1);
      } catch (err) {
         console.error("Error deleting user:", err);
         toast.error(err.response?.data?.message || "Failed to delete user");
      }
   };

   if (loading) {
      return (
         <div className="flex items-center justify-center h-[70vh]">
            <Loader className="w-8 h-8 animate-spin text-[#3498DB]" />
         </div>
      );
   }

   if (!user) {
      return (
         <div className="flex items-center justify-center h-[70vh] text-gray-500">
            User not found
         </div>
      );
   }

   return (
      <motion.div initial={ { opacity: 0, y: 20 } } animate={ { opacity: 1, y: 0 } } transition={ { duration: 0.5 } }>
         {/* Back Button */ }
         <Link
            to="/admin/users"
            className="flex items-center gap-2 text-[#3498DB] hover:text-[#2A7CBF] mb-8 font-medium"
         >
            <ArrowLeft className="w-5 h-5" /> Back
         </Link>

         {/* Profile Card */ }
         <motion.div
            whileHover={ { scale: 1.01 } }
            className="bg-gradient-to-br from-white to-blue-50 shadow-xl rounded-2xl border border-[#3498DB]/20 overflow-hidden"
         >
            {/* Banner */ }
            <div className="h-28 bg-gradient-to-r from-[#3498DB] to-[#2A7CBF]"></div>

            {/* Content */ }
            <div className="relative p-6">
               {/* Profile Image */ }
               <div className="absolute -top-12 left-6">
                  { user.imageUrl ? (
                     <img
                        src={ user.imageUrl }
                        alt={ user.fullName }
                        className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                     />
                  ) : (
                     <div className="w-24 h-24 rounded-full bg-[#3498DB]/10 flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-10 h-10 text-[#3498DB]" />
                     </div>
                  ) }
               </div>

               {/* Header */ }
               <div className="ml-32">
                  <h2 className="text-2xl font-bold text-[#2C3E50] flex items-center gap-2">
                     { user.fullName }
                     { user.suspended && (
                        <span className="text-red-500 text-sm font-medium">(Suspended)</span>
                     ) }
                  </h2>
                  <p className="text-sm text-gray-500 capitalize">{ user.role }</p>
               </div>

               {/* Divider */ }
               <div className="border-t border-gray-200 my-6"></div>

               {/* Info Section */ }
               <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-gray-700">
                  <div className="flex items-center gap-3">
                     <Mail className="w-5 h-5 text-[#3498DB]" />
                     <span>{ user.email }</span>
                  </div>

                  <div className="flex items-center gap-3">
                     <Calendar className="w-5 h-5 text-[#3498DB]" />
                     <span>Joined { new Date(user.createdAt).toDateString() }</span>
                  </div>

                  { user.location && (
                     <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-[#3498DB]" />
                        <span>{ user.location }</span>
                     </div>
                  ) }

                  { user.bio && (
                     <div className="flex items-center gap-3 md:col-span-2">
                        <Info className="w-8 h-8 text-[#3498DB]" />
                        <span>{ user.bio }</span>
                     </div>
                  ) }
               </div>

               {/* Socials */ }
               { (user.twitter || user.linkedin) && (
                  <div className="flex gap-4 pt-6">
                     { user.twitter && (
                        <a
                           href={ user.twitter }
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 text-[#3498DB] hover:text-[#2A7CBF] font-medium"
                        >
                           <Twitter className="w-5 h-5" />
                           Twitter
                        </a>
                     ) }
                     { user.linkedin && (
                        <a
                           href={ user.linkedin }
                           target="_blank"
                           rel="noopener noreferrer"
                           className="flex items-center gap-2 text-[#3498DB] hover:text-[#2A7CBF] font-medium"
                        >
                           <Linkedin className="w-5 h-5" />
                           LinkedIn
                        </a>
                     ) }
                  </div>
               ) }
            </div>
         </motion.div>

         {/* Quick Actions */ }
         <div className="flex flex-wrap gap-4 mt-8">
            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               onClick={ () => setIsMessageOpen(true) }
               className="flex items-center gap-2 bg-[#3498DB] hover:bg-[#2A7CBF] text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
            >
               <MessageSquare size={ 18 } /> Message
            </motion.button>

            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               onClick={ handleSuspend }
               className={ `flex items-center gap-2 ${user.suspended
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white px-5 py-2 rounded-lg shadow-md font-medium transition` }
            >
               { user.suspended ? <CheckCircle size={ 18 } /> : <Ban size={ 18 } /> }
               { user.suspended ? "Reactivate" : "Suspend" }
            </motion.button>

            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               onClick={ handleDelete }
               className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
            >
               <Trash2 size={ 18 } /> Delete
            </motion.button>
         </div>

         {/* Message Modal */ }
         <MessageModal
            isOpen={ isMessageOpen }
            onClose={ () => setIsMessageOpen(false) }
            onSend={ handleSendMessage }
            user={ user }
         />
      </motion.div>
   );
};

export default UserProfile;
