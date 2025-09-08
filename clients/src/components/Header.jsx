import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Header = () => {
   return (
      <section className="bg-[#1E293B] text-white py-20 px-6 md:px-12 lg:px-24 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
         {/* Left Text Content */ }
         <motion.div
            initial={ { x: -50, opacity: 0 } }
            animate={ { x: 0, opacity: 1 } }
            transition={ { duration: 0.6 } }
            className="max-w-xl text-center md:text-left"
         >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
               Turn Ideas into Reality with <span className="text-[#FACC15]">KLYNTFUND</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
               Discover, support, or launch powerful ideas. A better way to fund the future.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
               <Link
                  to="/login"
                  onClick={ () => scrollTo(0, 0) }
                  className="bg-[#FACC15] hover:bg-[#eab308] text-[#0F172A] font-semibold py-3 px-6 rounded-md transition"
               >
                  Get Started
               </Link>
               <Link
                  to="/projects"
                  onClick={ () => scrollTo(0, 0) }
                  className="border border-white text-white hover:text-[#60A5FA] hover:border-[#60A5FA] font-semibold py-3 px-6 rounded-md transition"
               >
                  Explore Projects
               </Link>
            </div>
         </motion.div>

         {/* Right Visual */ }
         <motion.div
            initial={ { x: 50, opacity: 0 } }
            animate={ { x: 0, opacity: 1 } }
            transition={ { duration: 0.6 } }
            className="w-full md:w-1/2"
         >
            <img
               src={ assets.headerImg }
               alt="People collaborating"
               className="w-full max-w-md mx-auto md:mx-0"
            />
         </motion.div>
      </section>
   );
};

export default Header;
