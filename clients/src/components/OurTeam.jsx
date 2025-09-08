import { motion } from 'framer-motion';
import { FaTwitter, FaLinkedin, FaGithub } from 'react-icons/fa';
import { teamMembers } from '../assets/assets';


const OurTeam = () => {
   return (
      <motion.section
         initial={ { opacity: 0, y: 30 } }
         whileInView={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.5 } }
         className="py-16 bg-[#F9FAFB] px-6 lg:px-24"
      >
         <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0F172A] mb-4">Meet the Team</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
               Behind every great idea is a team of passionate people making it happen.
            </p>
         </div>

         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
            { teamMembers.map((member, index) => (
               <motion.div
                  key={ index }
                  initial={ { opacity: 0, y: 20 } }
                  whileInView={ { opacity: 1, y: 0 } }
                  transition={ { delay: index * 0.15 } }
                  className="bg-white rounded-xl shadow group hover:shadow-xl transition relative p-6 text-center"
               >
                  <img
                     src={ member.img }
                     alt={ member.name }
                     className="w-24 h-24 object-cover rounded-full mx-auto mb-4 border-4 border-[#FACC15]"
                  />
                  <h3 className="text-lg font-semibold text-[#0F172A]">{ member.name }</h3>
                  <p className="text-sm text-gray-500">{ member.role }</p>

                  {/* Social icons on hover */ }
                  <div className="absolute inset-0 bg-white/80 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                     <div className="flex gap-4 text-[#0F172A] text-xl">
                        <a href={ member.socials.twitter } target="_blank" rel="noopener noreferrer">
                           <FaTwitter className="hover:text-[#1DA1F2] transition" />
                        </a>
                        <a href={ member.socials.linkedin } target="_blank" rel="noopener noreferrer">
                           <FaLinkedin className="hover:text-[#0077B5] transition" />
                        </a>
                        <a href={ member.socials.github } target="_blank" rel="noopener noreferrer">
                           <FaGithub className="hover:text-black transition" />
                        </a>
                     </div>
                  </div>
               </motion.div>
            )) }
         </div>
      </motion.section>
   );
};

export default OurTeam;
