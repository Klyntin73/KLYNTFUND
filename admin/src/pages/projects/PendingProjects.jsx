import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Loader, Eye, CheckCircle2, XCircle, MapPin, User, Coins, ArrowLeft } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import { formatCurrencyAmount } from "../../utils/formatCurrency";

export default function PendingProjects () {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [projects, setProjects] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      fetchPendingProjects();
   }, [backendUrl]);

   const fetchPendingProjects = async () => {
      try {
         const res = await axios.get(`${backendUrl}/api/admin/projects/pending`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         setProjects(res.data.data || res.data);
      } catch (error) {
         console.error("Error fetching pending projects:", error);
         toast.error(error.response?.data?.message || "Failed to fetch pending projects. Please try again later.");
      } finally {
         setLoading(false);
      }
   };

   //Approve project
   const handleApprove = async (id) => {
      try {
         await axios.put(`${backendUrl}/api/admin/project/approve/${id}`,
  {},
  {
    headers: { Authorization: `Bearer ${adminToken}` },
  }
);

         toast.success("Project approved successfully");
         fetchPendingProjects();
      } catch (error) {
         console.error("Error approving project:", error);
         toast.error(error.response?.data?.message || "Failed to approve project.");
      }
   };

   //Reject project
   const handleReject = async (id) => {
      try {
         await axios.put(`${backendUrl}/api/admin/project/reject/${id}`, {},
  {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
         toast.success("Project rejected successfully");
         fetchPendingProjects();
      } catch (error) {
         console.error("Error rejecting project:", error);
         toast.error(error.response?.data?.message || "Failed to reject project.");
      }
   };

   return (
      <div>
         {/* Page Header */ }
         <motion.div
            initial={ { opacity: 0, y: -20 } }
            animate={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.6 } }
            className="mb-8"
         >
            <button
               onClick={ () => {
                  navigate(-1);
                  scrollTo(0, 0);
               } }
               className="flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-gray-700"
            >
               <ArrowLeft className="w-4 h-4 text-[#3498DB]" /> Back
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Pending Projects</h1>
            <p className="text-gray-600 text-sm">
               Review and approve newly submitted projects.
            </p>
         </motion.div>

         { loading ? (
            <div className="flex justify-center items-center h-64">
               <Loader size={ 32 } className="animate-spin text-yellow-400" />
            </div>
         ) : projects.length === 0 ? (
            <motion.div
               initial={ { opacity: 0 } }
               animate={ { opacity: 1 } }
               className="text-center text-gray-500"
            >
               No pending projects found.
            </motion.div>
         ) : (
            <motion.div
               className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
               initial="hidden"
               animate="visible"
               variants={ {
                  hidden: { opacity: 0 },
                  visible: {
                     opacity: 1,
                     transition: { staggerChildren: 0.1 },
                  },
               } }
            >
               { projects.map((project) => (
                  <motion.div
                     key={ project._id }
                     variants={ {
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                     } }
                     className="bg-white rounded-lg shadow hover:shadow-lg hover:border-sky-500 border border-transparent transition-all duration-300 flex flex-col"
                  >
                     {/* Thumbnail */ }
                     <div className="h-40 w-full overflow-hidden rounded-t-lg">
                        <img
                           src={ project.thumbnail }
                           alt={ project.title }
                           className="w-full h-full object-cover"
                        />
                     </div>

                     {/* Details */ }
                     <div className="p-4 flex flex-col flex-1">
                        <h2 className="text-lg font-semibold text-slate-900 mb-1">
                           { project.title }
                        </h2>
                        <p className="text-sm text-gray-500 line-clamp-2 flex-1">
                           { project.pitch }
                        </p>

                        {/* Info Section */ }
                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                           <div className="flex items-center gap-3">
                              <p className="flex items-center gap-1">
                                 <MapPin size={ 14 } className="text-sky-500" />{ " " }
                                 { project.location }
                              </p>
                              <p className="flex items-center gap-1">
                                 <User size={ 14 } className="text-yellow-500" />{ " " }
                                 { project.creator?.fullName || "Unknown" }
                              </p>
                           </div>
                           <div className="flex items-center gap-2">
                              <p>
                                 <span className="font-medium">Goal:</span>{ " " }
                                 { formatCurrencyAmount(project.goal) }
                              </p>
                              <p className="flex items-center gap-1">
                                 <Coins size={ 14 } className="text-green-500" /> Min Invest:{ " " }
                                 { formatCurrencyAmount(project.minInvestment) }
                              </p>
                           </div>
                        </div>

                        {/* Actions */ }
                        <div className="mt-4 flex flex-wrap gap-2">
                           <button
                              onClick={ () => handleApprove(project._id) }
                              className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-slate-900 px-3 py-1 rounded-full text-sm font-medium transition"
                           >
                              <CheckCircle2 size={ 16 } /> Approve
                           </button>
                           <button
                              onClick={ () => handleReject(project._id) }
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium transition"
                           >
                              <XCircle size={ 16 } /> Reject
                           </button>
                           <button
                              onClick={ () => navigate(`/admin/projects/view/${project._id}`) }
                              className="flex items-center gap-1 border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white px-3 py-1 rounded-full text-sm font-medium transition"
                           >
                              <Eye size={ 16 } />
                           </button>
                        </div>
                     </div>
                  </motion.div>
               )) }
            </motion.div>
         ) }
      </div>
   );
}
