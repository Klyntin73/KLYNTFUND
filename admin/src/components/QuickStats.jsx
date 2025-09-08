import { motion } from "framer-motion";
import { Users, FolderKanban, TrendingUp, BarChart, } from "lucide-react";
import { formatCurrencyAmount } from "../utils/formatCurrency";

// Animation Variants
const cardVariants = {
   initial: { opacity: 0, y: 20 },
   animate: (index) => ({
      opacity: 1,
      y: 0,
      transition: { delay: index * 0.1, duration: 0.5, ease: "easeOut" },
   }),
};

// StatCard Component
const StatCard = ({ index, label, count, icon, breakdown, color }) => {
   const renderBreakdown = () => {
      if (!breakdown || typeof breakdown !== "object") return null;

      const entries = Object.entries(breakdown).filter(
         ([_, val]) => val > 0
      );
      if (entries.length === 0) return null;

      if (label === "Total Investments") {
         const raised = formatCurrencyAmount(breakdown.amount || 0);
         return (
            <p className="text-xs mt-1 text-white/80">
               Raised: { raised }
            </p>
         );
      }

      return (
         <div className="text-xs mt-1 space-y-1 text-white/80">
            { entries.map(([key, val]) => (
               <div key={ key } className="flex justify-between">
                  <span className="capitalize">{ key }</span>
                  <span>{ val }</span>
               </div>
            )) }
         </div>
      );
   };

   return (
      <motion.div
         custom={ index }
         variants={ cardVariants }
         initial="initial"
         animate="animate"
         className={ `rounded-xl shadow-md p-5 text-white ${color} flex items-center justify-between transition-transform duration-300 hover:scale-[1.02]` }
      >
         <div>
            <p className="text-sm font-medium mb-1">{ label }</p>
            <h2 className="text-2xl font-semibold animate-pulse">
               { typeof count === "number" ? count.toLocaleString() : count }
            </h2>
            { renderBreakdown() }
         </div>
         <div
            className="p-3 bg-white/10 rounded-full"
            aria-label={ label + " icon" }
         >
            { icon }
         </div>
      </motion.div>
   );
};

// Main Component
const QuickStats = ({ stats }) => {
   if (!stats) return null;

   const cards = [
      {
         label: "Total Users",
         count: stats.totalUsers || 0,
         breakdown: stats.usersByStatus,
         icon: <Users size={ 26 } className="text-white" />,
         color: "bg-[#3498DB]",
      },
      {
         label: "Total Projects",
         count: stats.totalProjects || 0,
         breakdown: stats.projectStatusBreakdown,
         icon: <FolderKanban size={ 26 } className="text-white" />,
         color: "bg-[#2C3E50]",
      },
      {
         label: "Total Investments",
         count: stats.totalInvestments || 0,
         breakdown: { amount: stats.totalFundsRaised || 0 },
         icon: <TrendingUp size={ 26 } className="text-white" />,
         color: "bg-[#2A7CBF]",
      },
      {
         label: "Funds Raised",
         count: formatCurrencyAmount(stats.totalFundsRaised || 0),
         breakdown: null,
         icon: <BarChart size={ 26 } className="text-white" />,
         color: "bg-gradient-to-r from-blue-500 to-[#3498DB]",
      },
   ];

   return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
         { cards.map((card, index) => (
            <StatCard key={ index } index={ index } { ...card } />
         )) }
      </div>
   );
};

export default QuickStats;
