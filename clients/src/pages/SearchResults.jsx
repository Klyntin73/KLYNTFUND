import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import ShimmerLoader from '../components/ShimmerLoder';
import { fadeOut, formatCurrencyAmount } from '../helper/helper';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const SearchResults = () => {
   const [searchParams] = useSearchParams();
   const [results, setResults] = useState([]);
   const [loading, setLoading] = useState(true);
   const query = searchParams.get('query');
   const { backendUrl, currency } = useContext(AppContext);

   useEffect(() => {
      const fetchResults = async () => {
         setLoading(true);
         try {
            const { data } = await axios.get(`${backendUrl}/api/user/search?query=${encodeURIComponent(query)}`);
            if (data.success) setResults(data.data);
         } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error(error);
         } finally {
            setLoading(false);
         }
      };
      if (query) fetchResults();
   }, [query]);

   if (loading || !results) {
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
      <div className="px-4 py-6">

         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            { results.map((project, i) => (
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
                     <div className='flex justify-between text-sm text-gray-600 mb-4'>
                        <p className="text-sm text-gray-500 mb-2">By { project.creator?.fullName }</p>
                        <p className="text-gray-500 text-xs">
                           <FaMapMarkerAlt className="inline-block mr-1 text-blue-500" />
                           { project.location }
                        </p>
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
      </div>
   );
};

export default SearchResults;
