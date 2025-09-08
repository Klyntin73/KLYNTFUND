import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaUserCircle, FaTwitter, FaLinkedin, FaTimes, FaMapMarkerAlt, FaUsers, FaRocket } from 'react-icons/fa';
import { BsTag } from 'react-icons/bs';
import RelatedProjects from '../components/RelatedProjects';
import { formatCurrencyAmount } from '../helper/helper';
import ShimmerLoader from '../components/ShimmerLoder';
import axios from 'axios';
import { toast } from 'react-toastify';
import InterestCalculator from '../components/InterestCalculator';

const ProjectDetail = () => {
   const { id } = useParams();
   const { backendUrl, currency, token } = useContext(AppContext);
   const navigate = useNavigate();

   const [project, setProject] = useState(null);
   const [loading, setLoading] = useState(true);
   const [showCalculator, setShowCalculator] = useState(false);

   useEffect(() => {
      if (!token) {
         toast.warn("Please login to view project details");
         navigate('/login');
         return;
      }

      const fetchProject = async () => {
         try {
            const { data } = await axios.get(`${backendUrl}/api/user/projects/${id}`, {
               headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
               setProject(data.project);
            } else {
               toast.error(data.message);
            }
         } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      fetchProject();
   }, [id, backendUrl, token]);

   if (loading || !project) {
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

   return project && (
      <motion.div
         initial={ { opacity: 0 } }
         animate={ { opacity: 1 } }
         exit={ { opacity: 0 } }
         transition={ { duration: 0.6 } }
         className="bg-white text-[#0F172A] py-10 px-6 md:px-20"
      >
         {/* Breadcrumb & Hero */ }
         <div className="mb-6">
            <Link
               to="/projects"
               className="text-sm text-blue-600 flex items-center gap-2 hover:underline"
            >
               <FaArrowLeft /> Back to Projects
            </Link>
         </div>

         <div className="grid lg:grid-cols-2 gap-8">
            <div>
               <img
                  src={ project.thumbnail }
                  alt={ project.title }
                  className="rounded-xl w-full h-80 object-cover shadow-md"
               />
            </div>

            <div className="space-y-4">
               <h1 className="text-3xl font-bold">{ project.title }</h1>
               <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">By { project.creator?.fullName }</span>
                  <p className="text-gray-500 text-xs">
                     <FaMapMarkerAlt className="inline-block mr-1 text-blue-500" />
                     { project.location }
                  </p>
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                     <BsTag /> { project.category }
                  </span>
               </div>

               <p className="text-gray-700 leading-relaxed">
                  { project.overview }
               </p>

               {/* Funding Stats */ }
               <div>
                  {/* Progress Bar */ }
                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden mb-2">
                     <motion.div
                        initial={ { width: 0 } }
                        animate={ { width: `${project.percentageFunded}%` } }
                        transition={ { duration: 1 } }
                        className="h-3 bg-[#FACC15] rounded-full"
                     />
                  </div>

                  {/* Stats - Responsive Layout */ }
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                     <span className="w-full sm:w-auto">Raised: { formatCurrencyAmount(project.amountRaised) }
                     </span>
                     <span className="w-full sm:w-auto">{ project.percentageFunded }% Funded</span>
                     <span className="w-full sm:w-auto">{ project.daysLeft } Days Left</span>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                     <div>
                        <span className="w-full sm:w-auto">
                           Goal: { project.goal ? formatCurrencyAmount(project.goal, currency) : 'No goal set' }
                        </span>
                     </div>
                     <div>
                        <span className="text-xs text-blue-600">Min Invest: </span>
                        <span className="text-xs text-gray-600">
                           { project.minInvestment ? formatCurrencyAmount(project.minInvestment, currency) : 'No min investment' }
                        </span>
                     </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mb-4">
                     <div>
                        <span className="text-xs text-blue-600">Return Rate: </span>
                        <span>{ project.returnRate ? `${project.returnRate}%` : 'N/A' }</span>
                     </div>
                     <div>
                        <span className="text-xs text-blue-600">Repayment: </span>
                        <span>{ project.repaymentPeriod ? `${project.repaymentPeriod} Months` : "N/A" }</span>
                     </div>
                  </div>

                  {/* Impact */ }
                  <div>
                     <h2 className="text-lg font-semibold text-[#0F172A] mb-2 flex items-center gap-2">
                        <FaRocket className="text-green-600" />
                        Your Impact
                     </h2>
                     <ul className="list-disc list-inside text-gray-600 text-sm">
                        { project.impact && project.impact.map((point, index) => (
                           <li key={ index }>{ point }</li>
                        )) }
                     </ul>
                     <p className="mt-3 text-xs text-gray-500 flex items-center gap-1">
                        <FaUsers className="text-gray-400" /> <strong>{ project.investorCount } investors</strong> so far
                     </p>
                  </div>
               </div>

               {/* CTA And Calculator*/ }
               <div className="mt-6 space-y-6">
                  <Link
                     to={ `/invest/${project._id}` }
                     onClick={ () => scrollTo(0, 0) }
                     className="inline-block bg-[#FACC15] text-[#0F172A] font-semibold px-6 py-3 rounded hover:bg-yellow-400 transition"
                  >
                     Invest Now
                  </Link>

                  <button
                     onClick={ () => setShowCalculator(true) }
                     className="ml-4 inline-block bg-[#0F172A] text-white font-medium px-5 py-3 rounded hover:bg-[#313e5b] transition cursor-pointer"
                  >
                     Calculate Return
                  </button>

                  {/* Modal Overlay */ }
                  { showCalculator && (
                     <div className="fixed inset-0 z-50 bg-white/30 backdrop-blur-sm flex items-center justify-center px-4">
                        <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative p-6">
                           <button
                              onClick={ () => setShowCalculator(false) }
                              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 transition cursor-pointer"
                           >
                              <FaTimes className="text-xl" />
                           </button>

                           <InterestCalculator returnRate={ project.returnRate } minInvestment={ project.minInvestment } />
                        </div>
                     </div>
                  ) }
               </div>
            </div>
         </div>

         {/* Creator Section */ }
         <div className="mt-16 border-t pt-10 border-gray-400">
            <h3 className="text-2xl font-semibold mb-4">About the Creator</h3>
            <div className="flex items-center gap-6">
               { project.creator?.imageUrl ?
                  <img
                     src={ project.creator?.imageUrl }
                     alt="Profile"
                     className="mt-3 h-15 w-15 object-cover rounded-full"
                  /> :
                  <FaUserCircle className="text-6xl text-gray-400" />

               }
               <div>
                  <p className="text-lg font-semibold">{ project.creator?.fullName }</p>
                  <p className="text-sm text-gray-600">
                     { project.creator?.bio }
                  </p>
                  <div className="flex gap-4 mt-2 text-blue-600">
                     <a
                        href={ project.creator?.linkedin } className="hover:text-yellow-400"
                        target='_blank'>
                        <FaTwitter size={ 20 } />
                     </a>
                     <a
                        href={ project.creator?.twitter }
                        className="hover:text-yellow-400"
                        target='_blank'>
                        <FaLinkedin size={ 20 } />
                     </a>
                  </div>
               </div>
            </div>
         </div>

         <RelatedProjects currentProject={ project } />
      </motion.div>
   );
};

export default ProjectDetail;
