import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const FinalCTA = () => {
   return (
      <section className="bg-[#FACC15] py-16 px-6 md:px-12 lg:px-24 text-[#0F172A]">
         <motion.div
            initial={ { opacity: 0, y: 20 } }
            whileInView={ { opacity: 1, y: 0 } }
            transition={ { duration: 0.5 } }
            viewport={ { once: true } }
            className="text-center max-w-3xl mx-auto"
         >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
               Ready to Make an Impact?
            </h2>
            <p className="text-lg mb-8">
               Whether you're launching the next big idea or backing one — KLYNTFUND is the platform for change.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
               <Link
                  to="/creator/dashboard"
                  onClick={ () => scrollTo(0, 0) }
                  className="bg-[#0F172A] text-white font-semibold py-3 px-6 rounded-md hover:bg-[#1E293B] transition"
               >
                  Start a Project
               </Link>
               <Link
                  to="/projects"
                  onClick={ () => scrollTo(0, 0) }
                  className="border-2 border-[#0F172A] text-[#0F172A] font-semibold py-3 px-6 rounded-md hover:bg-[#0F172A] hover:text-white transition"
               >
                  Invest Now
               </Link>
            </div>
         </motion.div>
      </section>
   );
};

export default FinalCTA;
