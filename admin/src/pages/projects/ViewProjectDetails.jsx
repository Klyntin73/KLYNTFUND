import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
   Loader, ArrowLeft, MapPin, User, Coins, Target, Calendar,
   TrendingUp, XCircle, CheckCircle2, Mail
} from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { formatCurrencyAmount } from "../../utils/formatCurrency";

export default function ViewProjectDetails () {
   const { id } = useParams();
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [project, setProject] = useState(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchProject = async () => {
         try {
            const res = await axios.get(`${backendUrl}/api/admin/project/view/${id}`, {
               headers: { Authorization: `Bearer ${adminToken}` },
            });
            setProject(res.data.data);
         } catch (error) {
            console.error("Error fetching project:", error);
            toast.error(
               error.response?.data?.message ||
               "Failed to fetch project details. Please try again later."
            );
         } finally {
            setLoading(false);
         }
      };
      fetchProject();
   }, [id, backendUrl]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-64">
            <Loader size={ 32 } className="animate-spin text-yellow-400" />
         </div>
      );
   }

   if (!project) {
      return (
         <div className="text-center text-gray-500 mt-10">
            Project details not found.
         </div>
      );
   }

   return (
      <motion.div
         initial={ { opacity: 0, y: 15 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.6 } }
         className="mb-8"
      >
         {/* Back Button */ }
         <button
            onClick={ () => {
               navigate(-1);
               scrollTo(0, 0);
            } }
            className="flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-gray-700"
         >
            <ArrowLeft className="w-4 h-4 text-sky-500" /> Back
         </button>

         {/* Thumbnail */ }
         <motion.div
            initial={ { scale: 0.98 } }
            animate={ { scale: 1 } }
            transition={ { duration: 0.4 } }
            className="rounded-xl overflow-hidden shadow-xl border border-slate-800 relative"
         >
            <img
               src={ project.thumbnail }
               alt={ project.title }
               className="w-full h-64 object-cover"
            />
            {/* Overlay gradient for polish */ }
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent"></div>
         </motion.div>

         {/* Title & Meta */ }
         <div className="mt-6">
            <h1 className="text-3xl font-bold text-yellow-500">{ project.title }</h1>
            <p className="text-slate-900 text-sm mt-1">{ project.category }</p>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
               <span className="flex items-center gap-1">
                  <MapPin size={ 16 } className="text-sky-500" /> { project.location }
               </span>
               <span className="flex items-center gap-1">
                  <User size={ 16 } className="text-yellow-900" /> { project.creator?.fullName }
               </span>
               <span className="flex items-center gap-1">
                  <Mail size={ 16 } className="text-blue-700" /> { project.creator?.email }
               </span>
               <span className="flex items-center gap-1">
                  <Calendar size={ 16 } className="text-green-700" />{ " " }
                  { new Date(project.createdAt).toDateString() }
               </span>
            </div>
         </div>

         {/* Funding Info */ }
         <div className="grid md:grid-cols-3 gap-4 mt-8">
            { [
               { label: "Funding Goal", value: project.goal, icon: <Target size={ 18 } className="text-sky-500" /> },
               { label: "Min Investment", value: project.minInvestment, icon: <Coins size={ 18 } className="text-green-500" /> },
               { label: "Current Funding", value: project.currentFunding, icon: <TrendingUp size={ 18 } className="text-yellow-400" /> },
            ].map((item, idx) => (
               <motion.div
                  key={ idx }
                  whileHover={ { scale: 1.02 } }
                  className="bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700"
               >
                  <p className="flex items-center gap-2 text-gray-200">{ item.icon } { item.label }</p>
                  <h2 className="text-xl font-semibold text-white">
                     { formatCurrencyAmount(item.value) }
                  </h2>
               </motion.div>
            )) }
         </div>

         {/* Overview */ }
         <div className="mt-10 space-y-6">
            { [
               { title: "Overview", text: project.overview },
               { title: "Problem & Solution", text: project.problemSolution },
            ].map((section, idx) => (
               <motion.div
                  key={ idx }
                  initial={ { opacity: 0, y: 15 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { delay: idx * 0.1 } }
                  className="bg-gray-50 p-6 rounded-lg shadow-md"
               >
                  <h2 className="text-lg font-semibold text-slate-900">{ section.title }</h2>
                  <p className="text-gray-700 mt-2 leading-relaxed">{ section.text }</p>
               </motion.div>
            )) }

            {/* Impact */ }
            { project.impact?.length > 0 && (
               <motion.div
                  initial={ { opacity: 0, y: 15 } }
                  animate={ { opacity: 1, y: 0 } }
                  transition={ { delay: 0.3 } }
                  className="bg-gray-50 p-6 rounded-lg shadow-md"
               >
                  <h2 className="text-lg font-semibold text-slate-900">Project Impact</h2>
                  <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
                     { project.impact.map((point, idx) => (
                        <li key={ idx }>{ point }</li>
                     )) }
                  </ul>
               </motion.div>
            ) }
         </div>

         {/* Action Buttons for Admin */ }
         <div className="flex gap-4 mt-8">
            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               onClick={ async () => {
                  try {
                     await axios.put(`${backendUrl}/api/admin/project/approve/${project._id}`, {},
  {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
                     toast.success("Project approved successfully");
                     navigate(-1);
                  } catch (error) {
                     toast.error(error.response?.data?.message || "Failed to approve project");
                  }
               } }
               className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
            >
               <CheckCircle2 size={ 18 } /> Approve
            </motion.button>

            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               onClick={ async () => {
                  try {
                     await axios.put(`${backendUrl}/api/admin/project/reject/${project._id}`,  {},
  {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
                     toast.success("Project rejected successfully");
                     navigate(-1);
                  } catch (error) {
                     toast.error(error.response?.data?.message || "Failed to reject project");
                  }
               } }
               className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
            >
               <XCircle size={ 18 } /> Reject
            </motion.button>
         </div>
      </motion.div>
   );

}
