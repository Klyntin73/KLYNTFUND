import { motion } from "framer-motion";
import { Settings, Sparkles } from "lucide-react";

const Setting = () => {
   return (
      <motion.div
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.6 } }
         className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-tr from-white via-blue-50 to-white border border-blue-100 shadow-xl rounded-2xl space-y-4"
      >
         {/* Header */ }
         <div className="flex items-center gap-3 text-[#2C3E50]">
            <Settings size={ 24 } className="animate-spin-slow text-[#3498DB]" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Settings</h1>
         </div>

         {/* Greeting block */ }
         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 space-y-3">
            <div className="flex items-center gap-3">
               <Sparkles size={ 20 } className="text-yellow-500 animate-bounce" />
               <h2 className="text-lg font-semibold text-gray-800">
                  Welcome, Super Admin!
               </h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
               This is your control center — soon you’ll be able to update your credentials, manage email preferences, and customize how your admin dashboard behaves.
            </p>
            <p className="text-sm text-gray-500 italic">
               “With great power comes great responsibility.” ⚡
            </p>
         </div>
      </motion.div>
   );
};

export default Setting;
