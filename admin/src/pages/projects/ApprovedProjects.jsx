import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Trash2, Loader, CheckCircle, ArrowLeft, Eye } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { formatCurrencyAmount } from "../../utils/formatCurrency";
import { useNavigate } from "react-router-dom";

const ApprovedProjects = () => {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [projects, setProjects] = useState([]);
   const [deletingId, setDeletingId] = useState(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   // Fetch approved projects
   const fetchApprovedProjects = async () => {
      try {
         const res = await axios.get(`${backendUrl}/api/admin/projects/approved`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         setProjects(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err) {
         console.error("Error fetching approved projects:", err);
         toast.error(err.response?.data?.message || "Failed to load approved projects");
      } finally {
         setLoading(false);
      }
   };

   // Delete project
   const deleteProject = async (id) => {
      if (!window.confirm("Are you sure you want to delete this project?")) return;
      setDeletingId(id);
      try {
         await axios.delete(`${backendUrl}/api/admin/project/delete/${id}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         setProjects((prev) => prev.filter((proj) => proj._id !== id));
         toast.success("Project deleted successfully");
      } catch (err) {
         console.error("Error deleting project:", err);
         toast.error(err.response?.data?.message || "Failed to delete project");
      } finally {
         setDeletingId(null);
      }
   };

   useEffect(() => {
      fetchApprovedProjects();
   }, []);

   return (
      <motion.div
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
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
         <h1 className="text-2xl font-bold text-[#2C3E50] mb-4 flex items-center gap-2">
            <CheckCircle className="text-green-500" /> Approved Projects
         </h1>

         { loading ? (
            <div className="flex justify-center items-center py-10">
               <Loader className="animate-spin text-[#3498DB]" size={ 28 } />
            </div>
         ) : projects.length === 0 ? (
            <p className="text-gray-500">No approved projects found.</p>
         ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
               <table className="min-w-[900px] w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="bg-[#3498DB]/10 text-[#2C3E50] font-semibold">
                     <tr>
                        <th className="px-6 py-3">#</th>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Goal</th>
                        <th className="px-6 py-3">Current Funding</th>
                        <th className="px-6 py-3">Investors</th>
                        <th className="px-6 py-3">Creator</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Actions</th>
                     </tr>
                  </thead>
                  <tbody>
                     { projects.map((proj, index) => {
                        const isFullyFunded = proj.currentFunding >= proj.goal;
                        return (
                           <motion.tr
                              key={ proj._id }
                              initial={ { opacity: 0, y: 10 } }
                              animate={ { opacity: 1, y: 0 } }
                              transition={ { duration: 0.3 } }
                              className={ `${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                 } border-b border-[#3498DB]/10 hover:bg-[#3498DB]/5 transition-colors` }
                           >
                              <td className="px-4 py-3 border-t border-[#3498DB]/10 text-gray-500 font-medium">{ index + 1 }</td>
                              <td className="px-6 py-4 max-w-[180px] truncate">{ proj.title }</td>
                              <td className="px-6 py-4 max-w-[180px] truncate">{ proj.category }</td>
                              <td className="px-6 py-4 max-w-[180px] truncate">{ formatCurrencyAmount(proj.goal) }</td>
                              <td className="px-6 py-4 text-blue-600 font-semibold">
                                 { formatCurrencyAmount(proj.currentFunding) }
                              </td>
                              <td className="px-6 py-4 font-semibold">{ proj.investors?.length || 0 }</td>
                              <td className="px-6 py-4 max-w-[180px] truncate">{ proj.creator?.fullName }</td>
                              <td className="px-6 py-4">
                                 <span
                                    className={ `px-3 py-1 rounded-full text-xs font-semibold max-w-[180px] truncate ${isFullyFunded
                                       ? "bg-green-100 text-green-700"
                                       : "bg-yellow-100 text-yellow-700"
                                       }` }
                                 >
                                    { isFullyFunded ? "Fully Funded" : "Active" }
                                 </span>
                              </td>
                              <td className="px-6 py-4 flex items-center gap-2">
                                 {/* View Button */ }
                                 <motion.button
                                    whileHover={ { scale: 1.1 } }
                                    whileTap={ { scale: 0.95 } }
                                    onClick={ () => navigate(`/admin/projects/view/${proj._id}`) }
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                 >
                                    <Eye size={ 16 } />
                                    View
                                 </motion.button>

                                 {/* Delete Button */ }
                                 <motion.button
                                    whileHover={ { scale: 1.1 } }
                                    whileTap={ { scale: 0.95 } }
                                    onClick={ () => deleteProject(proj._id) }
                                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    disabled={ deletingId === proj._id }
                                 >
                                    { deletingId === proj._id ? (
                                       <Loader className="animate-spin" size={ 16 } />
                                    ) : (
                                       <Trash2 size={ 16 } />
                                    ) }
                                    Delete
                                 </motion.button>
                              </td>
                           </motion.tr>
                        );
                     }) }
                  </tbody>
               </table>
            </div>
         ) }
      </motion.div>
   );
};

export default ApprovedProjects;