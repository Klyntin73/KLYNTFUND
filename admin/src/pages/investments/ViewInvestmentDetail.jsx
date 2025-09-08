import { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import {
   ArrowLeft, Briefcase, DollarSign, TrendingUp, Clock, ShieldAlert,
   AlertTriangle, Loader, Trash2
} from "lucide-react";
import { formatCurrencyAmount } from "../../utils/formatCurrency";
import { toast } from "react-toastify";

export default function ViewInvestmentDetail () {
   const { backendUrl, adminToken } = useContext(AdminContext);
   const { projectId, paymentRef } = useParams();
   const navigate = useNavigate();

   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchDetail = async () => {
         try {
            const res = await axios.get(
               `${backendUrl}/api/admin/investment/view/${projectId}/${paymentRef}`, {
               headers: { Authorization: `Bearer ${adminToken}` },
            }
            );
            setData(res.data);
         } catch (error) {
            console.error("Error fetching investment detail:", error);
         } finally {
            setLoading(false);
         }
      };
      fetchDetail();
   }, [backendUrl, projectId, paymentRef]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-64">
            <Loader size={ 32 } className="animate-spin text-yellow-400" />
         </div>
      );
   }

   if (!data) {
      return (
         <div className="text-center text-red-500 font-medium mt-10">
            Investment not found
         </div>
      );
   }

   const {
      projectTitle, category, goal, currentFunding,
      returnRate, repaymentPeriod, investment,
      calculatedInterest
   } = data;

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
            <ArrowLeft className="w-4 h-4 text-sky-500" /> Back
         </button>

         {/* Project Info */ }
         <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-[#3498DB]/20 mb-6"
            whileHover={ { scale: 1.01 } }
         >
            <h1 className="text-2xl font-bold text-[#2C3E50] mb-2">{ projectTitle }</h1>
            <div className="flex items-center text-sm text-gray-500 mb-4">
               <Briefcase className="w-4 h-4 mr-1" />
               { category }
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
               <InfoBox icon={ <DollarSign /> } label="Goal" value={ `${formatCurrencyAmount(goal)}` } />
               <InfoBox icon={ <TrendingUp /> } label="Raised" value={ `${formatCurrencyAmount(currentFunding)}` } />
               <InfoBox icon={ <Clock /> } label="Repayment" value={ `${repaymentPeriod} months` } />
               <InfoBox icon={ <TrendingUp /> } label="Return Rate" value={ `${returnRate}%` } />
            </div>
         </motion.div>

         {/* Investment Info */ }
         <motion.div
            className="bg-white shadow-lg rounded-2xl p-6 border border-[#3498DB]/20"
            whileHover={ { scale: 1.01 } }
         >
            <h2 className="text-xl font-semibold text-[#2C3E50] mb-4">
               Investment Details
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center mb-4">
               <InfoBox icon={ <DollarSign /> } label="Amount Invested" value={ ` ${formatCurrencyAmount(investment.amount)}` } />
               { calculatedInterest !== null && (
                  <InfoBox icon={ <TrendingUp /> } label="Interest" value={ `${formatCurrencyAmount(calculatedInterest)}` } />
               ) }
               <InfoBox icon={ <Clock /> } label="Invested On" value={ new Date(investment.investedAt).toDateString() } />
            </div>

            {/* Status Section */ }
            <div className="flex flex-wrap gap-4 justify-center mt-6">
               { investment.isRepaid ? (
                  <StatusTag icon={ <ShieldAlert /> } text="Repaid" color="bg-green-100 text-green-700" />
               ) : (
                  <StatusTag icon={ <AlertTriangle /> } text="Pending Repayment" color="bg-yellow-100 text-yellow-700" />
               ) }

               { investment.isFraudulent && (
                  <StatusTag icon={ <ShieldAlert /> } text="Fraud Alert" color="bg-red-100 text-red-700" />
               ) }

               { investment.dispute && (
                  <StatusTag icon={ <AlertTriangle /> } text="Dispute" color="bg-orange-100 text-orange-700" />
               ) }
            </div>

         </motion.div>
         <motion.button
            whileHover={ { scale: 1.05 } }
            whileTap={ { scale: 0.95 } }
            onClick={ async () => {
               try {
                  await axios.delete(`${backendUrl}/api/admin/investment/delete/${paymentRef}`, {
                     headers: { Authorization: `Bearer ${adminToken}` },
                  });
                  toast.success("Project investment successfully");
                  navigate(-1);
               } catch (err) {
                  console.error("Error deleting investment:", err);
                  toast.error(err.response?.data?.message || "Failed to delete investment");
               }
            } }
            className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md font-medium transition mt-10"
         >
            <Trash2 size={ 18 } /> Delete
         </motion.button>
      </motion.div>
   );
}

function InfoBox ({ icon, label, value }) {
   return (
      <div className="p-4 rounded-xl border border-[#3498DB]/20 shadow-sm">
         <div className="flex items-center justify-center text-[#3498DB] mb-1">{ icon }</div>
         <p className="text-sm text-gray-500">{ label }</p>
         <p className="font-semibold text-[#2C3E50]">{ value }</p>
      </div>
   );
}

function StatusTag ({ icon, text, color }) {
   return (
      <div className={ `flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${color}` }>
         { icon }
         { text }
      </div>
   );
}
