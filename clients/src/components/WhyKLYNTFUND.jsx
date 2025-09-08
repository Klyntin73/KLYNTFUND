import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'motion/react';

const features = [
   'Secure Payments',
   'Transparent Milestones',
   'Admin-Verified Projects',
   'Community Feedback',
];

const fadeIn = {
   hidden: { opacity: 0, y: 20 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
   }),
};

const WhyKLYNTFUND = () => {
   return (
      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24 text-gray-800">
         <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose <span className="text-[#FACC15]">KLYNTFUND</span>?</h2>
            <p className="mt-3 text-gray-600">
               We’re more than just a crowdfunding platform — we’re a launchpad for game-changing ideas.
            </p>
         </div>

         <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            { features.map((feature, i) => (
               <motion.div
                  key={ feature }
                  variants={ fadeIn }
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  custom={ i }
                  className="flex items-start gap-4 bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition"
               >
                  <FaCheckCircle className="text-[#FACC15] mt-1" size={ 24 } />
                  <div>
                     <h4 className="text-lg font-semibold">{ feature }</h4>
                     <p className="text-sm text-gray-600 mt-1">
                        { feature === 'Secure Payments' && 'All transactions are encrypted and processed through trusted gateways.' }
                        { feature === 'Transparent Milestones' && 'Track progress and funding usage through public updates.' }
                        { feature === 'Admin-Verified Projects' && 'Every project goes through a quality and authenticity check.' }
                        { feature === 'Community Feedback' && 'Backers and creators can engage and improve project outcomes.' }
                     </p>
                  </div>
               </motion.div>
            )) }
         </div>
      </section>
   );
};

export default WhyKLYNTFUND;
