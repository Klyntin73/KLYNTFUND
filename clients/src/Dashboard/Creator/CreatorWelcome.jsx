import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaRegSmileBeam } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';

const CreatorWelcome = () => {
   const { projects, userData } = useContext(AppContext);

   const isNewUser = projects?.length === 0;


   return (
      <motion.div
         initial={ { opacity: 0, y: 30 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.5 } }
         className="bg-white rounded-xl shadow-md p-6 md:p-10"
      >
         <div className="flex items-center mb-4">
            <FaRegSmileBeam className="text-yellow-400 text-3xl mr-3" />
            <h2 className="text-2xl font-bold text-[#0F172A]">
               Welcome { <span className="text-[#FACC15]">{ userData?.fullName }</span> || 'Creator' }
            </h2>
         </div>

         { isNewUser ? (
            <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
               It looks like you're just getting started! Use this dashboard to launch your first project, set funding goals, and share your ideas with the world. We're excited to have you on KLYNTFUND — let's build something amazing together!
            </p>
         ) : (
            <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
               Welcome back! Manage your projects, track your funding progress, and engage your supporters — all from your dashboard. Keep creating, keep inspiring, and let’s continue making a difference together!
            </p>
         ) }
      </motion.div>
   );
};

export default CreatorWelcome;
