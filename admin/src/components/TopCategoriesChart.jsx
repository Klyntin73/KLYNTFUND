import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";
import {
   BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
   ResponsiveContainer
} from "recharts";

const TopCategoriesChart = ({ data }) => {

   if (!Array.isArray(data) || data.length === 0) {
      return (
         <div className="bg-white rounded-xl p-5 shadow-md text-center text-sm text-gray-500">
            No category data available.
         </div>
      );
   }

   return (
      <motion.div
         className="bg-white rounded-xl p-5 shadow-md"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
      ><div className="flex items-center gap-2 text-[#2C3E50] mb-4">
            <FolderOpen size={ 20 } />
            <h3 className="text-lg font-semibold">Top Project Categories</h3>
         </div>
         <ResponsiveContainer width="100%" height={ Math.max(250, data.length * 40) }>
            <BarChart data={ data } layout="vertical">
               <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
               <XAxis type="number" stroke="#6B7280" />
               <YAxis
                  type="category"
                  dataKey="_id"
                  stroke="#6B7280"
                  tickFormatter={ (value) =>
                     value.length > 20 ? `${value.slice(0, 20)}...` : value
                  }
               />
               <Tooltip
                  contentStyle={ { backgroundColor: "#fff", border: "1px solid #eee" } }
                  labelStyle={ { color: "#3498DB", fontWeight: 500 } }
               />
               <Bar
                  dataKey="count"
                  fill="#3498DB"
                  radius={ [0, 6, 6, 0] }
                  barSize={ 20 }
               />
            </BarChart>
         </ResponsiveContainer>
      </motion.div>
   );
};

export default TopCategoriesChart;
