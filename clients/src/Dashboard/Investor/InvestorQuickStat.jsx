import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import ShimmerLoader from '../../components/ShimmerLoder';
import { cardVariants, formatCurrencyAmount } from '../../helper/helper';
import { motion } from 'framer-motion';
import {
   FaMoneyBillWave, FaProjectDiagram,
   FaChartLine, FaTrophy, FaClock, FaListOl
} from 'react-icons/fa';

const InvestorQuickStat = () => {
   const navigate = useNavigate();
   const { getInvestorDashboardStats, investorStats, token, currency } = useContext(AppContext);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!token) {
         toast.warn("Please log in to access your dashboard.");
         navigate('/login', { replace: true });
         window.scrollTo(0, 0);
         return;
      }
      setLoading(true);
      getInvestorDashboardStats().finally(() => setLoading(false));
   }, [token, navigate]);

   if (loading || !investorStats) {
      return (
         <div className="grid md:grid-cols-3 gap-6 mt-8">
            { Array.from({ length: 3 }).map((_, idx) => (
               <div key={ idx } className="p-5 rounded-lg shadow-md space-y-4 bg-white">
                  <ShimmerLoader height="h-8" width="w-2/3" />
                  <ShimmerLoader height="h-6" width="w-1/3" />
               </div>
            )) }
         </div>
      );
   }

   const stats = [
      {
         label: 'Total Invested',
         value: formatCurrencyAmount(investorStats.totalInvested, currency),
         icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
         color: 'bg-green-50',
      },
      {
         label: 'Total Expected Return',
         value: formatCurrencyAmount(investorStats.totalExpectedReturn || 0, currency),
         icon: <FaChartLine className="text-2xl text-emerald-600" />,
         color: 'bg-emerald-50',
      },
      {
         label: 'Projects Supported',
         value: investorStats.projectsSupported,
         icon: <FaProjectDiagram className="text-2xl text-purple-600" />,
         color: 'bg-purple-50',
      },
      {
         label: 'Avg Investment/Project',
         value: formatCurrencyAmount(investorStats.averageInvestmentPerProject || 0, currency),
         icon: <FaChartLine className="text-2xl text-blue-500" />,
         color: 'bg-blue-50',
      },
      {
         label: 'Highest Investment',
         value: formatCurrencyAmount(investorStats.highestSingleInvestment || 0, currency),
         icon: <FaTrophy className="text-2xl text-yellow-500" />,
         color: 'bg-yellow-50',
      },
      {
         label: 'Total Investments',
         value: investorStats.totalInvestmentCount || 0,
         icon: <FaListOl className="text-2xl text-indigo-500" />,
         color: 'bg-indigo-50',
      },
      {
         label: 'Most Recent Project',
         value: investorStats.mostRecentProject?.title || '—',
         icon: <FaClock className="text-2xl text-rose-500" />,
         color: 'bg-rose-50',
      },
   ];

   const isZeroData =
      investorStats.totalInvested === 0 &&
      investorStats.projectsSupported === 0 &&
      investorStats.totalInvestmentCount === 0 &&
      !investorStats.mostRecentProject?.title;

   return (
      <div className="mt-8 space-y-4">
         { isZeroData && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-center shadow">
               <p className="text-sm">
                  You haven’t made any investments yet — your insights will appear here once you support a project.
               </p>
            </div>
         ) }

         <div className="grid md:grid-cols-3 gap-6">
            { stats.map((stat, i) => (
               <motion.div
                  key={ stat.label }
                  variants={ cardVariants }
                  initial="hidden"
                  animate="visible"
                  custom={ i }
                  className={ `p-5 rounded-lg shadow-md flex items-center space-x-4 ${stat.color}` }
               >
                  <div className="bg-white p-3 rounded-full shadow">{ stat.icon }</div>
                  <div>
                     <p className="text-gray-600 text-sm">{ stat.label }</p>
                     <h3 className="text-xl font-bold text-[#0F172A]">{ stat.value }</h3>
                  </div>
               </motion.div>
            )) }
         </div>
      </div>
   );
};

export default InvestorQuickStat;
