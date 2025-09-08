import { motion } from "framer-motion";
import {
   List,
   UserPlus,
   FilePlus,
   UserX,
   Activity as DefaultIcon
} from "lucide-react";

const iconMap = {
   signup: UserPlus,
   project_post: FilePlus,
   suspend: UserX,
   default: DefaultIcon
};

const ActivityLog = ({ logs = [] }) => {
   return (
      <motion.div
         className="bg-white rounded-xl p-5 shadow-md"
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
      >
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#2C3E50] flex items-center gap-2">
               <List size={ 20 } className="text-[#3498DB]" />
               Recent Activity
            </h3>
         </div>

         <ul className="space-y-4">
            { logs.map((log, index) => {
               const Icon = iconMap[log.type] || iconMap.default;

               return (
                  <li key={ index } className="flex items-start gap-3 text-sm text-gray-700">
                     <Icon size={ 18 } className="mt-1 text-[#3498DB]" />
                     <div>
                        <p className="leading-snug">{ log.message }</p>
                        <span className="text-xs text-gray-400">
                           { new Date(log.timestamp).toLocaleString() }
                        </span>
                     </div>
                  </li>
               );
            }) }
         </ul>

         { logs.length === 0 && (
            <p className="text-center text-gray-500 text-sm">No recent activity found.</p>
         ) }
      </motion.div>
   );
};

export default ActivityLog;
