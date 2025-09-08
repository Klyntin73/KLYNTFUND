import { motion } from "framer-motion";
import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   Tooltip,
   ResponsiveContainer,
   CartesianGrid,
} from "recharts";

const ProjectTrends = ({ data }) => {
   const hasData = Array.isArray(data) && data.length > 0;

   return (
      <motion.div
         className="bg-white rounded-xl p-5 shadow-md"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
      >
         <h3 className="text-lg font-semibold text-[#2C3E50] mb-4">
            📊 Projects Over Time
         </h3>

         { hasData && data.some(item => item.count > 0) ? (
            <ResponsiveContainer width="100%" height={ Math.max(250, data.length * 40) }>
               <LineChart data={ data }>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis
                     dataKey="day"
                     stroke="#6B7280"
                     interval="preserveStartEnd"
                     minTickGap={ 10 }
                     tickFormatter={ (day) => new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }
                  />
                  <YAxis stroke="#6B7280" allowDecimals={ false } />
                  <Tooltip
                     contentStyle={ {
                        backgroundColor: "#fff",
                        border: "1px solid #eee",
                     } }
                     labelStyle={ { color: "#3498DB", fontWeight: 500 } }
                     formatter={ (value) => [`${value}`, "Projects"] }
                  />
                  <Line
                     type="monotone"
                     dataKey="count"
                     stroke="#3498DB"
                     strokeWidth={ 3 }
                     dot={ { r: 4 } }
                     activeDot={ { r: 6, stroke: "#2A7CBF", strokeWidth: 2 } }
                  />
               </LineChart>
            </ResponsiveContainer>
         ) : (
            <div className="text-sm text-gray-500 text-center py-10">
               No project data available for this period.
            </div>
         ) }
      </motion.div>
   );
};

export default ProjectTrends;
