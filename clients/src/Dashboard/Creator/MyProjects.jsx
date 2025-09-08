import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaEye } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { fadeIn, formatCurrencyAmount } from '../../helper/helper';
import ShimmerLoader from '../../components/ShimmerLoder';


const MyProjects = () => {
   const { dashProject, token, getDashProject, currency } = useContext(AppContext);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (token) {
         getDashProject().finally(() => setLoading(false));
      }
   }, [token]);

   // Loading state
   if (loading || !dashProject) {
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
      <section className="p-6 mb-20">
         <h2 className="text-2xl font-bold text-[#0F172A] mb-6">My Projects</h2>

         { dashProject.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No Project Added yet.</div>
         ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               { dashProject.map((project, i) => (
                  <motion.div
                     key={ project._id }
                     className={ `relative bg-[#F8FAFC] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${project.percentageFunded >= 100 ? 'opacity-70 pointer-events-none' : ''
                        }` }
                     variants={ fadeIn }
                     initial="hidden"
                     whileInView="visible"
                     viewport={ { once: true } }
                     custom={ i }
                  >
                     { project.percentageFunded >= 100 && (
                        <span className="absolute top-2 right-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full shadow">
                           Goal Met
                        </span>
                     ) }

                     <img
                        src={ project.thumbnail }
                        alt={ project.title }
                        className="w-full h-40 object-cover"
                     />

                     <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                           <h3 className="text-lg font-semibold text-[#0F172A]">{ project.title }</h3>
                           <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600">{ project.category }</div>
                        </div>

                        <div className="w-full bg-gray-200 h-3 rounded-full mb-2">
                           <div
                              className={ `h-3 rounded-full transition-all duration-500 ${project.percentageFunded >= 100 ? 'bg-green-500' : 'bg-[#FACC15]'
                                 }` }
                              style={ { width: `${Math.min(project.percentageFunded, 100)}%` } }
                           />
                        </div>
                        <div className='flex justify-between'>

                           <div className="text-xs text-gray-600 mb-2">
                              { project.percentageFunded }% funded ({ formatCurrencyAmount(project.amountRaised, currency) })
                           </div>
                           <span className="text-xs text-gray-500 mb-1">
                              { project.daysLeft } days left
                           </span>
                        </div>

                        <div className='flex justify-between'>
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
                              <span>{ project.repaymentPeriod ? `${project.repaymentPeriod} Months` : "N/A" }</span>
                           </div>
                        </div>

                        <div className="flex justify-between text-sm text-[#0F172A]">
                           <Link
                              to={ `/projects/${project._id}` }
                              className="flex items-center gap-1 hover:text-blue-600"
                           >
                              <FaEye /> View
                           </Link>
                           <Link
                              to={ `/creator/edit/${project._id}` }
                              className="flex items-center gap-1 hover:text-yellow-500"
                           >
                              <FaEdit /> Edit
                           </Link>
                        </div>
                     </div>
                  </motion.div>
               )) }
            </div>
         ) }

      </section>
   );
};

export default MyProjects;
