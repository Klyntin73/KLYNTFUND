import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { formatCurrencyAmount } from '../../helper/helper';
import ShimmerLoader from '../../components/ShimmerLoder';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const MyInvestments = () => {
   const { getInvestorInvestments, investorInvestments, currency } = useContext(AppContext);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getInvestorInvestments().finally(() => setLoading(false));
   }, []);

   if (loading) {
      return (
         <div className="grid md:grid-cols-2 gap-6 mt-8">
            { Array.from({ length: 3 }).map((_, idx) => (
               <div key={ idx } className="p-5 rounded-lg shadow bg-white space-y-3">
                  <ShimmerLoader height="h-5" width="w-3/4" />
                  <ShimmerLoader height="h-4" width="w-1/2" />
                  <ShimmerLoader height="h-3" width="w-full" />
               </div>
            )) }
         </div>
      );
   }

   return (
      <motion.section
         initial={ { opacity: 0, y: 30 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.5 } }
         className="min-h-screen py-10 px-4 md:px-10">
         <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">My Investments</h2>

         { investorInvestments?.length === 0 ? (
            <p className="text-gray-600">You haven’t invested in any project yet.</p>
         ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
               { investorInvestments.map((inv, idx) => {
                  const project = inv.project;

                  return (
                     <div key={ idx }
                        className={ `relative bg-[#F8FAFC] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${project.percentageFunded >= 100 ? 'opacity-70 pointer-events-none' : ''
                           }` }>
                        { project?.thumbnail ? (
                           <img
                              src={ project.thumbnail }
                              alt={ project.title }
                              className="w-full h-36 object-cover rounded mb-3"
                           />
                        ) : (
                           <div className="w-full h-36 bg-gray-300 rounded mb-3" />
                        ) }
                        <div className='p-5'>
                           <h3 className="text-lg font-semibold text-[#0F172A] mb-1">
                              { project?.title || 'Unknown Project' }
                           </h3>
                           <div className='flex justify-between text-sm text-gray-600 mb-4'>
                              <p className="text-xs text-gray-500 mb-2">By { project?.fullName }</p>
                              <p className="text-gray-500 text-xs">
                                 <FaMapMarkerAlt className="inline-block mr-1 text-blue-500" />
                                 { project.location }
                              </p>
                           </div>

                           <p className="text-xs text-gray-600 mb-2">
                              Amount Invested: { formatCurrencyAmount(inv.amount, currency) }
                           </p>

                           <p className="text-xs text-gray-600 mb-2">
                              Expected Return: { formatCurrencyAmount(inv.expectedReturn, currency) }
                           </p>

                           <p className="text-xs text-gray-500 mb-2">
                              Status:{ ' ' }
                              <span className={ `font-medium ${project?.percentageFunded >= 100 ? 'text-green-600' : 'text-blue-600'}` }>
                                 { project?.percentageFunded >= 100 ? 'Funded' : 'In Progress' }
                              </span>
                           </p>

                           {/* Progress Bar */ }
                           <div className="w-full bg-gray-200 h-2 rounded-full">
                              <div
                                 className={ `h-2 rounded-full transition-all duration-500 ${project?.percentageFunded >= 100 ? 'bg-green-500' : 'bg-yellow-400'}` }
                                 style={ { width: `${Math.min(project?.percentageFunded || 0, 100)}%` } }
                              />
                           </div>
                           <p className="text-xs text-gray-500 mt-1">
                              { project?.percentageFunded || 0 }% funded
                           </p>
                        </div>
                     </div>
                  );
               }) }
            </div>

         ) }
      </motion.section>
   );
};

export default MyInvestments;
