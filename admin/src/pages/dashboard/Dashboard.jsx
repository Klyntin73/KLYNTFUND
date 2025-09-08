import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { Loader, AlertTriangle } from "lucide-react";
import { AdminContext } from "../../context/AdminContext";
import QuickStats from "../../components/QuickStats";
import ProjectTrends from "../../components/ProjectTrends";
import TopCategoriesChart from "../../components/TopCategoriesChart";
import InvestmentTrend from "../../components/InvestmentTrend";
import NewUsers from "../../components/NewUsers";
import ActivityLog from "../../components/ActivityLog";

const containerVariants = {
   hidden: { opacity: 0 },
   visible: {
      opacity: 1,
      transition: {
         staggerChildren: 0.15,
         duration: 0.4
      }
   }
};

const Dashboard = () => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const { backendUrl, adminToken } = useContext(AdminContext);

   const fetchAnalytics = async () => {

      try {
         const res = await axios.get(`${backendUrl}/api/admin/dashboard-analytics`, {
            headers: { Authorization: `Bearer ${adminToken}` },
         });
         setData(res.data.data);

         setError(null);
      } catch (err) {
         console.error("Failed to load analytics:", err);
         setError("Unable to load dashboard analytics.");
         toast.error("Failed to load dashboard analytics.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAnalytics();
      const interval = setInterval(fetchAnalytics, 60000);
      return () => clearInterval(interval);
   }, []);

   if (loading) {
      return (
         <motion.div className="flex justify-center items-center h-[60vh]">
            <Loader className="animate-spin text-gray-500" size={ 32 } />
         </motion.div>
      );
   }

   if (error) {
      return (
         <motion.div
            className="p-6 text-center text-red-500 flex flex-col items-center justify-center space-y-2"
            initial={ { opacity: 0 } }
            animate={ { opacity: 1 } }
            transition={ { duration: 0.3 } }
         >
            <AlertTriangle size={ 36 } className="text-red-500" />
            <p className="text-lg font-semibold">{ error }</p>
            <p className="text-sm text-gray-500">Please try again later.</p>
         </motion.div>
      );
   }

   return (
      <motion.div
         className="space-y-6"
         variants={ containerVariants }
         initial="hidden"
         animate="visible"
      >

         <motion.div>
            <QuickStats stats={ data?.quickStats || {} } />
         </motion.div>

         <motion.div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               {
                  (
                     <TopCategoriesChart data={ data?.projectActivity.topCategories || [] } />
                  )
               }
               { data?.projectActivity.projectsOverTime > 0 && (
                  <ProjectTrends data={ data?.projectActivity.projectsOverTime || [] } />
               ) }
            </div>
         </motion.div>

         <motion.div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
               { data?.investmentOverview.fundsOverTime > 0 && (
                  <InvestmentTrend data={ data?.investmentOverview.fundsOverTime || [] } />
               ) }

               {
                  Array.isArray(data?.userEngagement.newUsersThisMonth) > 0 && (
                     <NewUsers data={ Array.isArray(data?.userEngagement.newUsersThisMonth) ? data.userEngagement.newUsersThisMonth : [] } />
                  ) }
            </div>
         </motion.div>

         <motion.div>
            {
               data?.userEngagement.activityLog > 0 && (
                  <ActivityLog logs={ Array.isArray(data?.userEngagement.activityLog) ? data.userEngagement.activityLog : [] } />
               ) }
         </motion.div>
      </motion.div>
   );
};

export default Dashboard;
