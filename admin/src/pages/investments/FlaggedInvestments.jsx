import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AlertTriangle, Mail, User, FileText, Calendar, Loader, ArrowLeft } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const FlaggedInvestments = () => {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const [flagged, setFlagged] = useState([]);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchFlagged = async () => {
         try {
            const res = await axios.get(`${backendUrl}/api/admin/investments/flagged`, {
               headers: { Authorization: `Bearer ${adminToken}` },
            });
            setFlagged(res.data.data || []);
         } catch (err) {
            console.error("Error fetching flagged investments:", err);
            toast.error("Failed to load flagged investments");
         } finally {
            setLoading(false);
         }
      };
      fetchFlagged();
   }, [backendUrl, adminToken]);

   return (
      <div className="">
         <button
            onClick={ () => {
               navigate(-1);
               scrollTo(0, 0);
            } }
            className="flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-gray-700"
         >
            <ArrowLeft className="w-4 h-4 text-[#3498DB]" /> Back
         </button>
         <div className="flex justify-center">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-yellow-600">
               <AlertTriangle className="w-6 h-6" />
               Flagged Investments
            </h1>
         </div>

         { loading ? (
            <div className="flex justify-center items-center py-10">
               <Loader className="animate-spin text-[#3498DB]" size={ 28 } />
            </div>
         ) : flagged.length === 0 ? (
            <p className="flex justify-center text-gray-500">No flagged investments found at the moment.</p>
         ) : (
            <div className="grid gap-4">
               { flagged.map((inv, index) => (
                  <motion.div
                     key={ inv._id }
                     initial={ { opacity: 0, y: 30 } }
                     animate={ { opacity: 1, y: 0 } }
                     transition={ { delay: index * 0.1 } }
                     className="p-5 rounded-2xl bg-slate-800 shadow-md border border-slate-700 hover:border-sky-500 transition-colors"
                  >
                     {/* Project Info */ }
                     <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold text-yellow-400 flex items-center gap-2">
                           <FileText className="w-5 h-5" />
                           { inv.project.title }
                        </h2>
                        <span className="text-xs bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full">
                           { inv.project.category }
                        </span>
                     </div>

                     {/* Investor Info */ }
                     <div className="space-y-2 text-sm">
                        <p className="flex items-center gap-2 text-gray-400">
                           <User className="w-4 h-4" />
                           <span>{ inv.investor.fullName }</span>
                        </p>
                        <p className="flex items-center gap-2 text-gray-400">
                           <Mail className="w-4 h-4" />
                           <span>{ inv.investor.email }</span>
                        </p>
                     </div>

                     {/* Investment Details */ }
                     <div className="mt-3 space-y-2">
                        <p className="text-sm">
                           <span className="font-semibold text-gray-400">Amount:</span>{ " " }
                           <span className="text-yellow-400">GHS { inv.amount }</span>
                        </p>
                        <p className="text-sm">
                           <span className="font-semibold text-gray-400">Payment Ref:</span>{ " " }
                           <span className="text-yellow-400">{ inv.paymentRef }</span>
                        </p>
                        <p className="flex items-center gap-2 text-xs text-gray-400">
                           <Calendar className="w-4 h-4" />
                           { new Date(inv.investedAt).toLocaleString() }
                        </p>
                     </div>

                     {/* Fraud Reasons */ }
                     { inv.fraudReasons?.length > 0 && (
                        <div className="mt-4 bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                           <p className="font-semibold text-red-400 text-sm flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4" />
                              Fraud Reasons:
                           </p>
                           <ul className="list-disc list-inside text-gray-300 text-sm mt-1">
                              { inv.fraudReasons.map((reason, idx) => (
                                 <li key={ idx }>{ reason }</li>
                              )) }
                           </ul>
                        </div>
                     ) }
                  </motion.div>
               )) }
            </div>
         ) }
      </div>
   );
};

export default FlaggedInvestments;
