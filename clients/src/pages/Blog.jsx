import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegClock } from 'react-icons/fa';
import { blogPosts } from '../assets/assets';
import FAQ from '../components/FAQ';
import { motion } from 'framer-motion';


const Blog = () => {
   return (
      <section className="bg-[#F8FAFC] py-16 px-4 sm:px-8 lg:px-16">
         <motion.div
            initial={ { opacity: 0, y: 40 } }
            animate={ { opacity: 1, y: 0 } }
            exit={ { opacity: 0, y: -40 } }
            transition={ { duration: 0.6 } }
            className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-12 text-center">
               Latest from <span className="text-[#FACC15]">KLYNTFUND</span>
            </h2>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
               { blogPosts.map((post) => (
                  <div
                     key={ post.id }
                     className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
                  >
                     <img
                        src={ post.image }
                        alt={ post.title }
                        className="w-full h-48 object-cover"
                     />
                     <div className="p-5 flex flex-col gap-3">
                        <h3 className="text-xl font-semibold text-[#0F172A]">
                           { post.title }
                        </h3>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                           <FaRegClock className="text-yellow-500" />
                           { post.date }
                        </p>
                        <p className="text-gray-700 text-sm">{ post.summary }</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                           { post.tags.map((tag, idx) => (
                              <span
                                 key={ idx }
                                 className="bg-[#E0E7FF] text-blue-900 text-xs px-3 py-1 rounded-full"
                              >
                                 #{ tag }
                              </span>
                           )) }
                        </div>
                        <Link
                           to={ `/blog/${post.id}` }
                           className="mt-4 text-sm font-medium text-[#0F172A] hover:text-blue-700 underline"
                           onClick={ () => scrollTo(0, 0) }
                        >
                           Read more →
                        </Link>
                     </div>
                  </div>
               )) }
            </div>

            <FAQ />
         </motion.div>
      </section>
   );
};

export default Blog;
