import React from 'react';
import { motion } from 'motion/react';
import { FaLightbulb, FaHandHoldingUsd, FaRocket } from 'react-icons/fa';

const steps = [
   {
      icon: <FaLightbulb size={ 32 } className="text-[#FACC15]" />,
      title: 'Create a Project',
      description: 'Share your idea with the world. Add images, a description, and funding goals.',
   },
   {
      icon: <FaHandHoldingUsd size={ 32 } className="text-[#FACC15]" />,
      title: 'Get Funded',
      description: 'Attract investors who believe in your vision and want to support your journey.',
   },
   {
      icon: <FaRocket size={ 32 } className="text-[#FACC15]" />,
      title: 'Launch Your Idea',
      description: 'Bring your project to life and make an impact with the funds you’ve raised.',
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

const HowItWorks = () => {
   return (
      <section className="bg-gray-50 py-20 px-6 md:px-12 lg:px-24">
         <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">How <span className="text-[#FACC15]">KLYNTFUND</span> Works</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
               Whether you're launching your next big idea or investing in innovation, KLYNTFUND is simple and impactful.
            </p>
         </div>

         <div className="grid md:grid-cols-3 gap-10">
            { steps.map((step, i) => (
               <motion.div
                  key={ i }
                  variants={ fadeInUp }
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  custom={ i }
                  className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-xl transition"
               >
                  <div className="mb-4">{ step.icon }</div>
                  <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{ step.title }</h3>
                  <p className="text-gray-600 text-sm">{ step.description }</p>
               </motion.div>
            )) }
         </div>
      </section>
   );
};

export default HowItWorks;
