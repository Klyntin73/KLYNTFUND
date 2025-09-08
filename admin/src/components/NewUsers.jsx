import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";

const NewUsers = ({ data }) => {
   const isValidArray = Array.isArray(data) && data.length > 0;
   const total = isValidArray
      ? data.reduce((sum, d) => sum + (d.count || 0), 0)
      : 0;

   return (
      <motion.div
         className="bg-white rounded-xl p-5 shadow-md"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
      >
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2C3E50] flex items-center gap-2">
               <UserPlus size={ 20 } className="text-[#3498DB]" />
               New Users This Month
            </h3>
            <span className="text-[#3498DB] font-semibold">
               +{ total.toLocaleString() }
            </span>
         </div>

         { isValidArray ? (
            <ResponsiveContainer width="100%" height={ 180 }>
               <BarChart data={ data }>
                  <XAxis dataKey="date" tick={ { fontSize: 12 } } />
                  <Tooltip formatter={ (value) => `${value} users` } />
                  <Bar
                     dataKey="count"
                     fill="#3498DB"
                     radius={ [4, 4, 0, 0] }
                     isAnimationActive={ true }
                  />
               </BarChart>
            </ResponsiveContainer>
         ) : (
            <div className="text-center text-sm text-gray-400 py-6">
               No new user data available.
            </div>
         ) }
      </motion.div>
   );
};

export default NewUsers;
