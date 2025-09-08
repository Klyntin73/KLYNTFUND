import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { FaRegSmileBeam } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';

const InvestorWelcome = () => {
   const { investorStats, userData } = useContext(AppContext);

   const isNewInvestor = investorStats?.projectsSupported === 0;

   return (
      <motion.div
         initial={ { opacity: 0, y: 30 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.5 } }
         className="bg-white rounded-xl shadow-md p-6 md:p-10"
      >
         <div className="flex items-center mb-4">
            <FaRegSmileBeam className="text-yellow-400 text-3xl sm:text-3xl mr-3" />
            <h2 className="text-lg sm:text-2xl font-bold text-[#0F172A]">
               Welcome <span className="text-[#FACC15]">{ userData?.fullName || 'Investor' }</span>
            </h2>
         </div>

         { isNewInvestor ? (
            <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
               It looks like you're just getting started! Use this dashboard to explore projects, make your first investment, and support ideas that inspire you. We're thrilled to have you on KLYNTFUND — let's grow impact together!
            </p>
         ) : (
            <p className="text-gray-700 leading-relaxed text-[16px] md:text-[17px]">
               Welcome back! Here you can track your investments, monitor the impact of your contributions, and discover new opportunities to support bold ideas. Thanks for being part of the KLYNTFUND community!
            </p>
         ) }
      </motion.div>
   );
};

export default InvestorWelcome;
