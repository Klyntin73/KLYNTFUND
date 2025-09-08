import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const faqs = [
   {
      question: 'How do I start a project on KLYNTFUND?',
      answer: 'Simply sign up, go to your dashboard, and click "Create Project". You’ll be guided through uploading images, setting milestones, and submitting for review.',
   },
   {
      question: 'How does the funding process work?',
      answer: 'Investors browse projects and fund those they believe in. Once a project is fully funded, funds are released in milestones to ensure accountability.',
   },
   {
      question: 'Is it safe to invest on KLYNTFUND?',
      answer: 'Yes! All projects are verified by our admin team, and payments are handled through secure, encrypted channels.',
   },
   {
      question: 'Can I edit my project after publishing?',
      answer: 'Yes, but major changes must be re-approved by the admin team to maintain transparency with investors.',
   },
];

const FAQ = () => {
   const [openIndex, setOpenIndex] = useState(null);

   const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <section className="bg-gray-50 py-16 px-4 sm:px-8 lg:px-16" id="faq">
         <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">
               Frequently Asked Questions
            </h2>
            <div className="space-y-4 text-left">
               { faqs.map((faq, index) => (
                  <div
                     key={ index }
                     className="bg-white border border-gray-200 rounded-lg shadow-md"
                  >
                     <button
                        onClick={ () => toggleFAQ(index) }
                        className="w-full flex items-center justify-between p-4 text-lg font-medium text-left text-gray-800 hover:text-[#FACC15] focus:outline-none"
                     >
                        { faq.question }
                        { openIndex === index ? (
                           <FiChevronUp className="text-xl" />
                        ) : (
                           <FiChevronDown className="text-xl" />
                        ) }
                     </button>
                     <AnimatePresence>
                        { openIndex === index && (
                           <motion.div
                              initial={ { height: 0, opacity: 0 } }
                              animate={ { height: 'auto', opacity: 1 } }
                              exit={ { height: 0, opacity: 0 } }
                              transition={ { duration: 0.3 } }
                           >
                              <div className="p-4 pt-0 text-gray-700">
                                 { faq.answer }
                              </div>
                           </motion.div>
                        ) }
                     </AnimatePresence>
                  </div>
               )) }
            </div>
         </div>
      </section>
   );
};

export default FAQ;
