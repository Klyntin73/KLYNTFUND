import { Menu, LogOut, Clock3, UserCircle2 } from 'lucide-react';
import { useContext, useState, useEffect } from 'react';
import { SidebarContext } from '../context/SidebarContext';
import { AdminContext } from '../context/AdminContext';
import { motion, useAnimation } from 'framer-motion';

const Header = ({ adminName = 'Loveland' }) => {
   const { toggleSidebar } = useContext(SidebarContext);
   const { handleLogout } = useContext(AdminContext);
   const pageTitle = 'Admin Panel';

   const [currentTime, setCurrentTime] = useState(new Date());
   const controls = useAnimation(); // 👈 Control the pulse animation

   useEffect(() => {
      const interval = setInterval(() => {
         setCurrentTime(new Date());

         // Trigger pulse animation
         controls.start({
            scale: [1, 1.25, 1],
            transition: { duration: 0.4 },
         });
      }, 60000); // Every 60 seconds

      return () => clearInterval(interval);
   }, [controls]);

   return (
      <motion.header
         initial={ { y: -20, opacity: 0 } }
         animate={ { y: 0, opacity: 1 } }
         transition={ { duration: 0.4 } }
         className="w-full bg-gray-50 shadow-sm border-b border-gray-200 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4"
      >
         {/* Left: Page title + toggle */ }
         <div className="flex items-center gap-4">
            <button
               onClick={ toggleSidebar }
               className="sm:hidden text-slate-900"
               aria-label="Toggle sidebar"
            >
               <Menu size={ 24 } />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 uppercase">
               { pageTitle }
            </h1>
         </div>

         {/* Center: Clock */ }
         <div className="hidden sm:flex flex-1 justify-center">
            <div className="flex items-center gap-2 bg-gray-200 px-4 py-1.5 rounded-full shadow-sm text-sm text-slate-900">
               <motion.div animate={ controls }>
                  <Clock3 size={ 18 } className="text-yellow-500" />
               </motion.div>
               { currentTime.toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
               }) }
            </div>
         </div>

         {/* Right: Admin Info & Logout */ }
         <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 text-slate-900 font-medium">
               <UserCircle2 className="text-sky-500" size={ 24 } />
               <span className="hidden sm:block">{ adminName }</span>
            </div>
            <button
               className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
               title="Logout"
               onClick={ handleLogout }
            >
               <LogOut size={ 20 } />
            </button>
         </div>
      </motion.header>
   );
};

export default Header;
