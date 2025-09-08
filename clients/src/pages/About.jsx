import React from 'react';
import { motion } from 'framer-motion';
import OurTeam from '../components/OurTeam';
import { Link } from 'react-router-dom';

const About = () => {
   return (
      <section className="bg-white min-h-screen py-16 px-6 lg:px-24">
         <div className="max-w-6xl mx-auto space-y-16">

            {/* Hero Title */ }
            <motion.div
               initial={ { opacity: 0, y: 40 } }
               animate={ { opacity: 1, y: 0 } }
               exit={ { opacity: 0, y: -40 } }
               transition={ { duration: 0.6 } }
               className="text-center"
            >
               <h1 className="text-4xl font-bold text-[#0F172A] mb-4">About <span className="text-[#FACC15]">KLYNTFUND</span></h1>
               <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  KLYNTFUND is a community-powered crowdfunding platform where dreamers meet doers.
                  We connect passionate creators with supportive investors to turn ideas into impactful realities.
               </p>
            </motion.div>

            {/* Mission & Vision */ }
            <div className="grid md:grid-cols-2 gap-12">
               <motion.div
                  initial={ { opacity: 0, x: -40 } }
                  whileInView={ { opacity: 1, x: 0 } }
                  transition={ { duration: 0.6 } }
                  className="space-y-4"
               >
                  <h2 className="text-2xl font-semibold text-[#0F172A]">🌍 Our Mission</h2>
                  <p className="text-gray-700">
                     To empower innovators by providing a transparent, secure, and scalable platform
                     that fuels creative projects through community-driven funding.
                  </p>
               </motion.div>

               <motion.div
                  initial={ { opacity: 0, x: 40 } }
                  whileInView={ { opacity: 1, x: 0 } }
                  transition={ { duration: 0.6 } }
                  className="space-y-4"
               >
                  <h2 className="text-2xl font-semibold text-[#0F172A]">🚀 Our Vision</h2>
                  <p className="text-gray-700">
                     We envision a world where every brilliant idea, regardless of background or resources,
                     has a fair shot at success through community support and investment.
                  </p>
               </motion.div>
            </div>

            {/* Platform Values */ }
            <motion.div
               initial={ { opacity: 0, y: 30 } }
               whileInView={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.5 } }
               className="bg-gray-50 rounded-lg shadow-sm p-8"
            >
               <h3 className="text-2xl font-bold text-[#0F172A] mb-6 text-center">Our Core Values</h3>
               <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  { [
                     'Transparency',
                     'Security',
                     'Community',
                     'Innovation'
                  ].map((value, index) => (
                     <div key={ index } className="p-4 rounded-md hover:bg-white transition shadow hover:shadow-md">
                        <span className="text-[#FACC15] text-3xl font-bold">{ value }</span>
                     </div>
                  )) }
               </div>
            </motion.div>

            <OurTeam />

            {/* Join CTA */ }
            <motion.div
               initial={ { opacity: 0, y: 30 } }
               whileInView={ { opacity: 1, y: 0 } }
               transition={ { duration: 0.6 } }
               className="text-center"
            >
               <h3 className="text-2xl font-semibold text-[#0F172A] mb-4">Be part of something big</h3>
               <p className="text-gray-600 max-w-xl mx-auto mb-6">
                  Whether you’re launching a project or looking to invest in the next big thing,
                  <span className="text-[#FACC15]">KLYNTFUND</span> is your platform for impact.
               </p>
               <div className="flex justify-center gap-4">
                  <Link
                     to="/login"
                     onClick={ () => scrollTo(0, 0) }
                     className="bg-[#FACC15] text-[#0F172A] font-semibold px-6 py-3 rounded hover:bg-yellow-400 transition"
                  >
                     Get Started
                  </Link>
                  <Link
                     to="/projects"
                     onClick={ () => scrollTo(0, 0) }
                     className="border border-[#0F172A] text-[#0F172A] font-semibold px-6 py-3 rounded hover:bg-[#0F172A] hover:text-white transition"
                  >
                     Explore Projects
                  </Link>
               </div>
            </motion.div>

         </div>
      </section>
   );
};

export default About;
