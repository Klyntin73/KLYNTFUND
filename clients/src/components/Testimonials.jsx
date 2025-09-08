import React from 'react';
import { motion } from 'motion/react';
import { testimonials } from '../assets/assets';


const fadeIn = {
   hidden: { opacity: 0, y: 20 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
   }),
};

const Testimonials = () => {
   return (
      <section className="bg-[#1E293B] text-white py-20 px-6 md:px-12 lg:px-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">What People Are Saying</h2>
            <p className="text-gray-300 mt-2">Real feedback from creators and investors in the <span className="text-[#FACC15]">KLYNTFUND</span> community.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-10">
            { testimonials.map((item, i) => (
               <motion.div
                  key={ i }
                  variants={ fadeIn }
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  custom={ i }
                  className="bg-[#0F172A] p-6 rounded-xl shadow-lg text-center"
               >
                  <img
                     src={ item.avatar }
                     alt={ item.name }
                     className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-[#FACC15]"
                  />
                  <p className="italic text-gray-100 mb-4">“{ item.quote }”</p>
                  <h4 className="font-semibold text-[#FACC15]">{ item.name }</h4>
                  <p className="text-sm text-gray-400">{ item.role }</p>
               </motion.div>
            )) }
         </div>
      </section>
   );
};

export default Testimonials;
