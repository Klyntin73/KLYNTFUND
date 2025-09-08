import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRegClock, FaArrowLeft } from 'react-icons/fa';
import { blogPosts } from '../assets/assets';

const BlogDetail = () => {
   const { id } = useParams();
   const blog = blogPosts.find((post) => post.id.toString() === id.toString());

   if (!blog) {
      return (
         <div className="min-h-[50vh] flex items-center justify-center text-xl text-gray-600">
            Blog post not found.
         </div>
      );
   }

   return (
      <motion.div
         initial={ { opacity: 0, y: 40 } }
         animate={ { opacity: 1, y: 0 } }
         exit={ { opacity: 0, y: -40 } }
         transition={ { duration: 0.6 } }
         className="bg-white py-12 px-4 sm:px-8 lg:px-24"
      >
         <div className="max-w-4xl mx-auto">
            <Link
               to="/blog"
               className="text-sm text-[#0F172A] font-medium flex items-center gap-2 hover:text-blue-600 mb-4"
            >
               <FaArrowLeft /> Back to Blog
            </Link>

            <img
               src={ blog.image }
               alt={ blog.title }
               className="w-full h-64 object-cover rounded-xl mb-6"
            />

            <h1 className="text-3xl font-bold text-[#0F172A] mb-2">{ blog.title }</h1>

            <div className="text-sm text-gray-600 flex items-center gap-2 mb-6">
               <FaRegClock className="text-yellow-500" />
               { blog.date }
            </div>

            <motion.div
               initial={ { opacity: 0 } }
               animate={ { opacity: 1 } }
               transition={ { delay: 0.3 } }
               className="prose max-w-none text-gray-800"
            >
               { blog.content.split('\n').map((line, i) => (
                  <p key={ i } className="mb-4">
                     { line.trim() }
                  </p>
               )) }
            </motion.div>

            <div className="mt-6 flex gap-3 flex-wrap">
               { blog.tags.map((tag, index) => (
                  <span
                     key={ index }
                     className="bg-[#E0E7FF] text-blue-900 text-xs px-3 py-1 rounded-full"
                  >
                     #{ tag }
                  </span>
               )) }
            </div>
         </div>
      </motion.div>
   );
};

export default BlogDetail;
