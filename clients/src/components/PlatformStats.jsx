import React from 'react';
import { FaUserFriends, FaProjectDiagram, FaMoneyBillWave } from 'react-icons/fa';
import { motion } from 'motion/react';
import CountUp from 'react-countup';

const stats = [
   {
      icon: <FaProjectDiagram size={ 32 } className="text-[#FACC15]" />,
      label: 'Projects Funded',
      value: 1240,
      suffix: '+',
   },
   {
      icon: <FaUserFriends size={ 32 } className="text-[#FACC15]" />,
      label: 'Active Users',
      value: 6800,
      suffix: '+',
   },
   {
      icon: <FaMoneyBillWave size={ 32 } className="text-[#FACC15]" />,
      label: 'Total Raised (GHS)',
      value: 3.2,
      decimals: 1,
      suffix: 'M+',
   },
];

const fadeIn = {
   hidden: { opacity: 0, y: 30 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
   }),
};

const PlatformStats = () => {
   return (
      <section className="bg-[#1E293B] py-20 px-6 md:px-12 lg:px-24 text-white">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold"><span className="text-[#FACC15]">KLYNTFUND</span> Impact</h2>
            <p className="text-gray-400 mt-2">A growing movement of ideas backed by passionate supporters.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-10 text-center">
            { stats.map((item, i) => (
               <motion.div
                  key={ i }
                  variants={ fadeIn }
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  custom={ i }
                  className="bg-[#0F172A] rounded-xl py-8 px-6 shadow-lg hover:shadow-xl transition"
               >
                  <div className="mb-4">{ item.icon }</div>
                  <h3 className="text-3xl font-bold text-[#FACC15]">
                     <CountUp
                        end={ item.value }
                        duration={ 4.5 }
                        separator=","
                        decimals={ item.decimals || 0 }
                        suffix={ item.suffix || '' }
                     />
                  </h3>
                  <p className="text-gray-300 mt-2">{ item.label }</p>
               </motion.div>
            )) }
         </div>
      </section>
   );
};

export default PlatformStats;
