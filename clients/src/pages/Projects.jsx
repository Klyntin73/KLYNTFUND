import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import { fadeOut, formatCurrencyAmount } from '../helper/helper';
import ShimmerLoader from '../components/ShimmerLoder';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt } from 'react-icons/fa';

const Projects = () => {
   const { projects, currency, getAllProjects } = useContext(AppContext);

   const [activeCategory, setActiveCategory] = useState('All');
   const [loading, setLoading] = useState(true);

   const allCategories = ['All', ...new Set(projects.map(p => p.category))];

   const filteredProjects = activeCategory === 'All'
      ? projects
      : projects.filter(p => p.category === activeCategory);

   useEffect(() => {
      getAllProjects().finally(() => setLoading(false));
   }, [getAllProjects]);

   if (loading || !projects) {
      return (
         <div className="grid md:grid-cols-3 gap-6 mt-8">
            { Array.from({ length: 3 }).map((_, idx) => (
               <div key={ idx } className="p-5 rounded-lg shadow-md space-y-4 bg-white">
                  <ShimmerLoader height="h-8" width="w-2/3" />
                  <ShimmerLoader height="h-6" width="w-1/3" />
               </div>
            )) }
         </div>
      );
   }

   return (
      <section className="bg-white min-h-screen py-16 px-6 md:px-12 lg:px-24">
         <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A]">All Projects</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">
               Browse through all ongoing and trending innovations on KLYNTFUND.
            </p>
         </div>

         {/* Filter Buttons */ }
         <div className="flex flex-wrap justify-center gap-3 mb-10">
            { allCategories.map((cat, idx) => (
               <button
                  key={ idx }
                  onClick={ () => setActiveCategory(cat) }
                  className={ `text-sm px-4 py-2 rounded-full border transition ${activeCategory === cat
                     ? 'bg-[#0F172A] text-white'
                     : 'bg-gray-100 text-[#0F172A] hover:bg-[#E2E8F0]'
                     }` }
               >
                  { cat }
               </button>
            )) }
         </div>

         {/* Project Cards */ }
         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            { filteredProjects.map((project, i) => (
               <motion.div
                  key={ project._id }
                  variants={ fadeOut }
                  initial="hidden"
                  whileInView="visible"
                  viewport={ { once: true } }
                  custom={ i }
                  className={ `relative bg-[#F8FAFC] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${project.percentageFunded >= 100 ? 'opacity-70 pointer-events-none' : ''
                     }` }
               >
                  { project.percentageFunded >= 100 && (
                     <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full shadow">
                        Goal Met
                     </span>
                  ) }

                  <img src={ project.thumbnail } alt={ project.title } className="w-full h-38 object-cover" />

                  <div className="p-5">
                     <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-semibold text-[#0F172A]">{ project.title }</h3>
                        <span className="bg-blue-100 text-blue-600 text-xs font-medium px-3 py-1 rounded-full">
                           { project.category }
                        </span>
                     </div>

                     <div className='flex justify-between text-sm text-gray-600 mb-2'>
                        <p className="text-xs text-gray-500 mb-2">By { project.creator.fullName }</p>
                        <p className="text-gray-500 text-xs">
                           <FaMapMarkerAlt className="inline-block mr-1 text-blue-500" />
                           { project.location }
                        </p>
                     </div>

                     {/* Progress Bar */ }
                     <div className="w-full bg-gray-200 h-3 rounded-full mb-2">
                        <div
                           className={ `h-3 rounded-full transition-all duration-500 ${project.percentageFunded >= 100 ? 'bg-green-500' : 'bg-[#FACC15]'
                              }` }
                           style={ { width: `${Math.min(project.percentageFunded, 100)}%` } }
                        />
                     </div>
                     <div className='flex justify-between'>

                        <div className="text-xs text-gray-600 mb-3">
                           { project.percentageFunded }% funded ({ formatCurrencyAmount(project.amountRaised) })
                        </div>
                        <span className="text-xs text-gray-500 mb-1">
                           { project.daysLeft } days left
                        </span>
                     </div>
                     <div className='flex justify-between mb-1'>
                        <div>
                           <span className="text-xs text-blue-600">Goal: </span>
                           <span className="text-xs text-gray-600">
                              { project.goal ? formatCurrencyAmount(project.goal, currency) : 'No goal set' }
                           </span>
                        </div>
                        <div className=''>
                           <span className="text-xs text-blue-600">Min Invest: </span>
                           <span className="text-xs text-gray-600">
                              { project.minInvestment ? formatCurrencyAmount(project.minInvestment, currency) : 'No min investment' }
                           </span>
                        </div>
                     </div>
                     <div className="flex justify-between text-xs text-gray-600 mb-4">
                        <div>
                           <span className="text-xs text-blue-600">Return Rate: </span>
                           <span className='text-xs'>{ project.returnRate ? `${project.returnRate}%` : 'N/A' }</span>
                        </div>
                        <div>
                           <span className="text-xs text-blue-600">Repayment: </span>
                           <span className='text-xs'>{ project.repaymentPeriod ? `${project.repaymentPeriod} Months` : "N/A" }</span>
                        </div>
                     </div>

                     <Link
                        to={ project.percentageFunded >= 100 ? '#' : `/projects/${project._id}` }
                        onClick={ (e) => {
                           if (project.percentageFunded >= 100) {
                              e.preventDefault();
                              toast.info("This project has reached its funding goal.");
                           } else {
                              scrollTo(0, 0);
                           }
                        } }
                        className={ `inline-block text-sm font-medium px-4 py-2 rounded transition
      ${project.percentageFunded >= 100
                              ? 'bg-gray-400 cursor-not-allowed text-white'
                              : 'bg-[#0F172A] hover:bg-[#1e293b] text-white'
                           }` }
                     >
                        { project.percentageFunded >= 100 ? 'Funding Complete' : 'View Project' }
                     </Link>
                  </div>
               </motion.div>
            )) }
         </div>
      </section>
   );
};

export default Projects;
