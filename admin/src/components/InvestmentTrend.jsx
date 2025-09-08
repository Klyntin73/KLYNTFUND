import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { BarChartBig } from "lucide-react";

const COLORS = ["#3498DB", "#2C3E50", "#6B7280", "#A0AEC0", "#4B5563"];

const InvestmentTrend = ({ data }) => {
   const isValidArray = Array.isArray(data) && data.length > 0;
   const total = isValidArray ? data.reduce((sum, d) => sum + (d.amount || 0), 0) : 0;
   const hasPositiveAmount = isValidArray && data.some((item) => item.amount > 0);


   return (
      <motion.div
         className="bg-white rounded-xl p-5 shadow-md"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
      >
         <div className="flex items-center gap-2 text-[#2C3E50] mb-4">
            <BarChartBig size={ 20 } />
            <h3 className="text-lg font-semibold">Funds Raised by Category</h3>
         </div>

         { isValidArray && hasPositiveAmount ? (
            <ResponsiveContainer width="100%" height={ 260 }>
               <BarChart data={ data }>
                  <CartesianGrid strokeDasharray="3 3" vertical={ false } />
                  <XAxis
                     dataKey="day"
                     tick={ { fill: "#6B7280", fontSize: 12 } }
                     axisLine={ false }
                     tickLine={ false }
                  />
                  <YAxis
                     domain={ [0, 'dataMax + 1000'] }
                     tick={ { fill: "#6B7280", fontSize: 12 } }
                     axisLine={ false }
                     tickLine={ false }
                     tickFormatter={ (value) => `GHS ${value / 1000}k` }
                  />
                  <Tooltip
                     formatter={ (value) => `GHS ${Number(value).toLocaleString()}` }
                     itemStyle={ { color: "#2C3E50" } }
                     cursor={ { fill: "rgba(52, 152, 219, 0.1)" } }
                  />
                  <Bar dataKey="amount" radius={ [6, 6, 0, 0] } isAnimationActive={ true }>
                     { data.map((_, index) => (
                        <Cell key={ `cell-${index}` } fill={ COLORS[index % COLORS.length] } />
                     )) }
                  </Bar>
               </BarChart>
            </ResponsiveContainer>
         ) : (
            <div className="text-gray-400 text-sm text-center py-8">
               No investment trend data available.
            </div>
         ) }

         <div className="text-sm text-gray-600 mt-2 text-center">
            Total Raised:{ " " }
            <span className="text-[#3498DB] font-semibold">
               GHS { total.toLocaleString() }
            </span>
         </div>
      </motion.div>
   );
};

export default InvestmentTrend;
