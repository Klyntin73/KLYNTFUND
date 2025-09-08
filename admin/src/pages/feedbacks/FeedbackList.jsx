import { useEffect, useState, useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import axios from 'axios';
import {
   Loader, MessageCircle, Trash2, Mail,
   AlertCircle, AlertTriangle, Ban, FileWarning, User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const feedbackTypeIconMap = {
   notice: {
      icon: <AlertCircle size={ 18 } />,
      color: "text-blue-600",
      bg: "bg-blue-100",
   },
   warning: {
      icon: <AlertTriangle size={ 18 } />,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
   },
   suspension: {
      icon: <Ban size={ 18 } />,
      color: "text-red-600",
      bg: "bg-red-100",
   },
   complaint: {
      icon: <FileWarning size={ 18 } />,
      color: "text-orange-600",
      bg: "bg-orange-100",
   },
   other: {
      icon: <MessageCircle size={ 18 } />,
      color: "text-purple-600",
      bg: "bg-purple-100",
   },
   default: {
      icon: <MessageCircle size={ 18 } />,
      color: "text-gray-600",
      bg: "bg-gray-100",
   },
};


const FeedbackList = () => {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [feedbacks, setFeedbacks] = useState([]);
   const [loading, setLoading] = useState(true);
   const [deletingId, setDeletingId] = useState(null);


   useEffect(() => {
      const fetchFeedbacks = async () => {
         try {
            const { data } = await axios.get(`${backendUrl}/api/admin/feedbacks/all`, {
               headers: { Authorization: `Bearer ${adminToken}` },
            });
            if (data.success) setFeedbacks(data.feedbacks);
         } catch (err) {
            console.error('Failed to fetch feedbacks:', err);
            toast.error(err.response?.data?.message || 'Failed to load feedbacks');
         } finally {
            setLoading(false);
         }
      };

      fetchFeedbacks();
   }, [backendUrl, adminToken]);

   const handleDelete = async (id) => {
      if (!window.confirm('Are you sure you want to delete this feedback?')) return;
      try {
         setDeletingId(id);
         const { data } = await axios.delete(`${backendUrl}/api/admin/feedback/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         if (data.success) {
            toast.success('Feedback deleted');
            setFeedbacks((prev) => prev.filter((f) => f._id !== id));
         }
      } catch (err) {
         console.error('Delete failed:', err);
         toast.error(err.response?.data?.message || 'Failed to delete feedback');
      } finally {
         setDeletingId(null);
      }
   };

   return (
      <section className="max-w-6xl mx-auto">
         <h2 className="text-2xl font-semibold text-[#2C3E50] flex items-center gap-2 mb-4">
            <User size={ 24 } className="text-[#3498DB]" />
            User Feedback
         </h2>

         { loading ? (
            <div className="flex justify-center py-16">
               <Loader className="animate-spin text-[#3498DB]" size={ 24 } />
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               { feedbacks.length === 0 ? (
                  <p className="text-gray-500">No feedback received yet.</p>
               ) : (
                  feedbacks.map((f) => {
                     const type = f?.type?.toLowerCase?.();
                     const { icon, color, bg } = feedbackTypeIconMap[type] || feedbackTypeIconMap.default;

                     return (
                        <motion.div
                           key={ f._id }
                           initial={ { opacity: 0, y: 10 } }
                           animate={ { opacity: 1, y: 0 } }
                           className="bg-gradient-to-br from-white via-blue-50 to-white p-5 rounded-2xl shadow-xl border border-blue-100 space-y-4 relative transition hover:shadow-2xl"
                        >
                           {/* Header: Icon + Type + Date */ }
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className={ `p-2 rounded-full ${bg} ${color}` }>
                                    { icon }
                                 </div>
                                 <span className="text-sm font-semibold text-[#2C3E50] uppercase">{ f.type }</span>
                              </div>
                              <span className="text-xs text-gray-500">{ new Date(f.createdAt).toDateString() }</span>
                           </div>

                           {/* Message */ }
                           <p className="text-gray-800 text-sm leading-relaxed font-medium italic">
                              “{ f.message }”
                           </p>

                           {/* Info block */ }
                           <div className="text-sm text-gray-600 space-y-1 border-t pt-3">
                              { f.email && (
                                 <p className="flex items-center gap-2">
                                    <Mail size={ 14 } className="text-gray-400" />
                                    <span className="font-medium">{ f.email }</span>
                                 </p>
                              ) }
                              { f.member && (
                                 <p className="flex items-center gap-2">
                                    <User size={ 14 } className="text-gray-400" />
                                    <span className="font-medium">{ f.member.fullName }</span> (
                                    <span className="text-[#3498DB]">{ f.member.email }</span>)
                                 </p>
                              ) }
                           </div>

                           {/* Delete button */ }
                           <div className="flex justify-end pt-4">
                              <button
                                 onClick={ () => handleDelete(f._id) }
                                 disabled={ deletingId === f._id }
                                 className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm font-medium"
                                 title="Delete feedback"
                              >
                                 { deletingId === f._id ? (
                                    <>
                                       <Loader size={ 16 } className="animate-spin" />
                                       <span>Deleting...</span>
                                    </>
                                 ) : (
                                    <>
                                       <Trash2 size={ 16 } />
                                       <span>Delete</span>
                                    </>
                                 ) }
                              </button>
                           </div>
                        </motion.div>
                     );
                  })

               ) }
            </div>
         ) }
      </section>
   );
};

export default FeedbackList;
