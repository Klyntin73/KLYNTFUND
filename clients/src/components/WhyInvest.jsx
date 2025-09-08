import React from 'react';
import { motion } from 'motion/react';
import { FaChartLine, FaShieldAlt, FaHandsHelping } from 'react-icons/fa';

const benefits = [
   {
      icon: <FaHandsHelping size={ 32 } className="text-[#FACC15]" />,
      title: 'Support Innovation',
      description: 'Invest in meaningful projects that solve real-world problems and drive progress.',
   },
   {
      icon: <FaShieldAlt size={ 32 } className="text-[#FACC15]" />,
      title: 'Transparent Process',
      description: 'Stay informed with project updates, funding usage, and milestones every step of the way.',
   },
   {
      icon: <FaChartLine size={ 32 } className="text-[#FACC15]" />,
      title: 'Track Your Impact',
      description: 'Measure how your investment contributes to the success and growth of projects.',
   },
];

const fadeInUp = {
   hidden: { opacity: 0, y: 30 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
   }),
};

const WhyInvest = () => {
   return (
      <section className="bg-white py-20 px-6 md:px-12 lg:px-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">Why Invest with <span className="text-[#FACC15]">KLYNTFUND</span></h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
               Back groundbreaking ideas, empower change, and track your contribution every step of the way.
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-10">
            { benefits.map((item, i) => (
               <motion.div
                  key={ i }
                  variants={ fadeInUp }
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  custom={ i }
                  className="bg-gray-50 rounded-xl shadow-sm p-8 text-center hover:shadow-lg transition"
               >
                  <div className="mb-4">{ item.icon }</div>
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{ item.title }</h3>
                  <p className="text-gray-600 text-sm">{ item.description }</p>
               </motion.div>
            )) }
         </div>
      </section>
   );
};

export default WhyInvest;
