import { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, CheckCircle2, Loader, ArrowLeft, ListOrdered, ChevronLeft, ChevronRight, Trash2, Eye } from 'lucide-react';
import axios from 'axios';
import { AdminContext } from '../../context/AdminContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { formatCurrencyAmount } from '../../utils/formatCurrency';

const AllInvestments = () => {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [investments, setInvestments] = useState([]);
   const [deletingId, setDeletingId] = useState(null);
   const [loading, setLoading] = useState(true);
   const [page, setPage] = useState(1);
   const [pages, setPages] = useState(1);
   const [search, setSearch] = useState('');
   const [status, setStatus] = useState('');
   const [flagged, setFlagged] = useState('');
   const navigate = useNavigate();

   const fetchInvestments = async () => {
      try {
         setLoading(true);
         const res = await axios.get(`${backendUrl}/api/admin/investments/all`, {
            headers: { Authorization: `Bearer ${adminToken}` },
            params: { page, search, status, flagged }
         });

         setInvestments(res.data.data);
         setPages(res.data.pages);
      } catch (err) {
         console.error('Error fetching investments:', err);
         toast.error(err.response?.data?.message || "Error fetching investments");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchInvestments();
   }, [page, search, status, flagged]);

   // Delete Investment
   const deleteInvestment = async (paymentRef) => {
      if (!window.confirm("Are you sure you want to delete this investment?")) return;
      setDeletingId(paymentRef);
      try {
         await axios.delete(`${backendUrl}/api/admin/investment/delete/${paymentRef}`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         setInvestments((prev) => prev.filter((i) => i.paymentRef !== paymentRef));
         toast.success("Project investment successfully");
      } catch (err) {
         console.error("Error deleting investment:", err);
         toast.error(err.response?.data?.message || "Failed to delete investment");
      } finally {
         setDeletingId(null);
      }
   };

   return (
      <motion.div
         className=""
         initial={ { opacity: 0 } }
         animate={ { opacity: 1 } }
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
            <ListOrdered className="text-green-500" /> All Investments
         </h1>
         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Search */ }
            <div className="relative w-full md:w-1/3">
               <Search className="absolute left-3 top-2.5 text-gray-400" size={ 20 } />
               <input
                  type="text"
                  placeholder="Search by investor or project..."
                  className="w-full outline-none pl-10 pr-4 py-2 rounded-lg border border-gray-500 focus:ring-2 focus:ring-blue-400"
                  value={ search }
                  onChange={ (e) => setSearch(e.target.value) }
               />
            </div>

            {/* Filters */ }
            <div className="flex gap-3">
               <select
                  className="px-3 py-2 rounded-lg border border-gray-500"
                  value={ status }
                  onChange={ (e) => setStatus(e.target.value) }
               >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
               </select>

               <select
                  className="px-3 py-2 rounded-lg border border-gray-500"
                  value={ flagged }
                  onChange={ (e) => setFlagged(e.target.value) }
               >
                  <option value="">All</option>
                  <option value="true">Flagged</option>
                  <option value="false">Not Flagged</option>
               </select>
            </div>
         </div>

         {/* Table */ }
         <div className="bg-white rounded-xl shadow">
            { loading ? (
               <div className="flex justify-center items-center p-10">
                  <Loader className="animate-spin text-blue-500" size={ 28 } />
               </div>
            ) : investments.length === 0 ? (
               <div className="p-6 text-center text-gray-500">No investments found</div>
            ) : (
               <div className="w-full overflow-x-auto">
                  <table className="min-w-[800px] w-full text-sm text-left border-separate border-spacing-0">
                     <thead className="bg-gradient-to-r from-[#3498DB]/10 to-white">
                        <tr>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">#</th>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">Investor</th>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">Project</th>
                           <th className="p-3 text-right text-[#2C3E50] font-semibold">Amount</th>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">Status</th>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">Date</th>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">Flagged</th>
                           <th className="p-3 text-left text-[#2C3E50] font-semibold">Actions</th>
                        </tr>
                     </thead>
                     <tbody>
                        { investments.map((inv, index) => (
                           <motion.tr
                              key={ inv._id }
                              className={ `${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                 } border-b border-[#3498DB]/10 hover:bg-[#3498DB]/5 transition-colors` }
                              initial={ { opacity: 0, y: 10 } }
                              animate={ { opacity: 1, y: 0 } }
                              transition={ { duration: 0.2 } }
                           >
                              <td className="px-4 py-3 text-gray-500 font-medium">{ index + 1 }</td>
                              <td className="p-3">
                                 <span className="font-medium">{ inv.investor.fullName }</span>
                                 <br />
                                 <span className="text-xs text-gray-500">{ inv.investor.email }</span>
                              </td>
                              <td className="max-w-[280px] truncate">{ inv.project.title }</td>
                              <td className="px-2 font-semibold text-[#3498DB] max-w-[180px]">
                                 { formatCurrencyAmount(inv.amount) }
                              </td>
                              <td
                                 className={ `p-3 capitalize font-medium ${inv.status === "approved"
                                    ? "text-green-600"
                                    : inv.status === "pending"
                                       ? "text-yellow-600"
                                       : inv.status === "rejected"
                                          ? "text-red-600"
                                          : "text-gray-600"
                                    }` }
                              >
                                 { inv.status }
                              </td>
                              <td className="text-gray-600 max-w-[180px] truncate">
                                 { new Date(inv.investedAt).toDateString() }
                              </td>
                              <td className="p-3">
                                 { inv.fraudFlag ? (
                                    <AlertTriangle className="text-red-500" size={ 20 } />
                                 ) : (
                                    <CheckCircle2 className="text-green-500" size={ 20 } />
                                 ) }
                              </td>
                              <td className="px-6 py-4 flex items-center gap-2">
                                 {/* View Button */ }
                                 <motion.button
                                    whileHover={ { scale: 1.1 } }
                                    whileTap={ { scale: 0.95 } }
                                    onClick={ () => navigate(`/admin/investment/view/${inv.project._id}/${inv.paymentRef}`) }
                                    className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
                                 >
                                    <Eye size={ 16 } />
                                    View
                                 </motion.button>

                                 {/* Delete Button */ }
                                 <motion.button
                                    whileHover={ { scale: 1.1 } }
                                    whileTap={ { scale: 0.95 } }
                                    onClick={ () => deleteInvestment(inv.paymentRef) }
                                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    disabled={ deletingId === inv._id }
                                 >
                                    { deletingId === inv._id ? (
                                       <Loader className="animate-spin" size={ 16 } />
                                    ) : (
                                       <Trash2 size={ 16 } />
                                    ) }
                                    Delete
                                 </motion.button>
                              </td>
                           </motion.tr>
                        )) }
                     </tbody>
                  </table>
               </div>
            ) }
         </div>

         {/* Pagination */ }
         <div className="flex justify-center items-center gap-3 mt-6">
            {/* Prev Button */ }
            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               disabled={ page === 1 }
               onClick={ () => setPage((p) => p - 1) }
               className={ `flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
      ${page === 1
                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                     : "bg-white text-[#3498DB] border-[#3498DB] hover:bg-[#3498DB] hover:text-white"}` }
            >
               <ChevronLeft size={ 18 } />
               Prev
            </motion.button>

            {/* Page Indicator */ }
            <motion.span
               key={ page }
               initial={ { opacity: 0, y: 5 } }
               animate={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.3 } }
               className="px-4 py-2 bg-[#3498DB]/10 rounded-full text-sm font-medium text-[#2C3E50]"
            >
               Page { page } of { pages }
            </motion.span>

            {/* Next Button */ }
            <motion.button
               whileHover={ { scale: 1.05 } }
               whileTap={ { scale: 0.95 } }
               disabled={ page === pages }
               onClick={ () => setPage((p) => p + 1) }
               className={ `flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
      ${page === pages
                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                     : "bg-white text-[#3498DB] border-[#3498DB] hover:bg-[#3498DB] hover:text-white"}` }
            >
               Next
               <ChevronRight size={ 18 } />
            </motion.button>
         </div>
      </motion.div>
   );
};

export default AllInvestments;
