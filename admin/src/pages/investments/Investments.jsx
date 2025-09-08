import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ListOrdered, AlertTriangle, RotateCcw, Handshake } from 'lucide-react';

const navCards = [
   {
      label: 'All Investments',
      description: 'View and manage all recorded investments.',
      icon: <ListOrdered size={ 28 } className="text-blue-500" />,
      to: '/admin/investments/all',
   },
   {
      label: 'Flagged Investments',
      description: 'Review investments flagged for potential fraud.',
      icon: <AlertTriangle size={ 28 } className="text-red-500" />,
      to: '/admin/investments/flagged',
   },
   {
      label: 'Refund Investments',
      description: 'Process and track refunded investments.',
      icon: <RotateCcw size={ 28 } className="text-orange-500" />,
      to: '/admin/investments/refunds',
   },
   {
      label: 'Disputed Investments',
      description: 'Handle investment disputes between parties.',
      icon: <Handshake size={ 28 } className="text-green-500" />,
      to: '/admin/investments/disputed',
   },
];


export default function Investments () {
   return (
      <motion.div
         initial={ { opacity: 0, y: 20 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.4 } }
      >
         <h2 className="text-2xl font-semibold text-[#2C3E50] mb-6">Project Management</h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            { navCards.map((card) => (
               <Link
                  key={ card.label }
                  to={ card.to }
                  className=" bg-white group border border-[#3498DB] rounded-2xl p-6 shadow-sm hover:shadow-md transition hover:bg-blue-50"
               >
                  <div className="flex items-center gap-4">
                     <div className="p-3 rounded-full bg-blue-100 group-hover:bg-white transition">
                        { card.icon }
                     </div>
                     <div>
                        <h3 className="text-lg font-medium text-[#2C3E50] group-hover:text-[#3498DB]">
                           { card.label }
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{ card.description }</p>
                     </div>
                  </div>
               </Link>
            )) }
         </div>
      </motion.div>
   );
}
