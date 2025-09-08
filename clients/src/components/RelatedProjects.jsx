import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const RelatedProjects = ({ currentProject }) => {
   const { projects, currency } = useContext(AppContext);

   const related = projects
      .filter(p => p.category === currentProject.category && p.id !== currentProject.id)
      .slice(0, 3); // limit to 3

   if (related.length === 0) return null;

   return (
      <section className="mt-20">
         <h3 className="text-2xl font-bold text-[#0F172A] mb-6">Related Projects</h3>
         <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            { related.map(project => (
               <div
                  key={ project.id }
                  className="bg-[#F8FAFC] rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
               >
                  <img src={ project.image } alt={ project.title } className="w-full h-36 object-cover" />
                  <div className="p-5">
                     <div className="flex justify-between items-center mb-2">
                        <h4 className="text-lg font-semibold text-[#0F172A]">{ project.title }</h4>
                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                           { project.category }
                        </span>
                     </div>
                     <p className="text-sm text-gray-500 mb-2">By { project.creator }</p>

                     <div className="w-full bg-gray-200 h-2 rounded-full mb-2">
                        <div
                           className="h-2 bg-[#FACC15] rounded-full"
                           style={ { width: `${project.funded}%` } }
                        />
                     </div>

                     <div className="text-xs text-gray-600 mb-2 flex justify-between">
                        <span>{ project.funded }% funded</span>
                        <span>{ project.daysLeft } days left</span>
                     </div>

                     <div className="text-xs text-gray-500 mb-4">
                        Raised: { currency } { project.raised.toLocaleString() } of { currency } { project.goal.toLocaleString() }
                     </div>

                     <Link
                        to={ `/projects/${project.id}` }
                        onClick={ () => scrollTo(0, 0) }
                        className="inline-block text-xs font-medium text-white bg-[#0F172A] px-3 py-1 rounded hover:bg-[#1e293b]"
                     >
                        View Project
                     </Link>
                  </div>
               </div>
            )) }
         </div>
      </section>
   );
};

export default RelatedProjects;
