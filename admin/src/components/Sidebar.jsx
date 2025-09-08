import {
   LayoutDashboard, FolderKanban, LineChart, Users, MessageCircle, Settings, LogOut, X
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { SidebarContext } from '../context/SidebarContext';
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
   { label: 'Dashboard', icon: <LayoutDashboard size={ 20 } />, path: '/admin/dashboard' },
   { label: 'Projects', icon: <FolderKanban size={ 20 } />, path: '/admin/projects' },
   { label: 'Investments', icon: <LineChart size={ 20 } />, path: '/admin/investments' },
   { label: 'Users', icon: <Users size={ 20 } />, path: '/admin/users' },
   { label: 'Feedbacks', icon: <MessageCircle size={ 20 } />, path: '/admin/feedbacks' },
   { label: 'Settings', icon: <Settings size={ 20 } />, path: '/admin/settings' },
];

const Sidebar = () => {
   const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);
   const { handleLogout } = useContext(AdminContext);

   return (
      <>
         {/* Mobile Overlay */ }
         <div
            className={ `fixed inset-0 bg-black/40 z-30 transition-opacity ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
               } sm:hidden` }
            onClick={ closeSidebar }
         />

         {/* Sidebar Animation for Mobile */ }
         <AnimatePresence>
            { isSidebarOpen && (
               <motion.aside
                  initial={ { x: -260 } }
                  animate={ { x: 0 } }
                  exit={ { x: -260 } }
                  transition={ { duration: 0.3 } }
                  className={ `
                     fixed top-0 left-0 h-screen w-64 z-40 bg-[#0F172A] text-gray-200 sm:hidden flex flex-col
                  `}
               >
                  {/* Logo & Close */ }
                  <div className="flex items-center justify-between p-6 text-yellow-400 font-bold text-2xl">
                     <span>KLYNTFUND</span>
                     <button className="text-gray-200" onClick={ closeSidebar }>
                        <X size={ 20 } />
                     </button>
                  </div>

                  <div className="flex flex-col flex-1 min-h-0">
                     <nav className="flex-1 overflow-y-auto px-4 pb-4">
                        { navItems.map(({ label, icon, path }) => (
                           <NavLink
                              key={ label }
                              to={ path }
                              onClick={ closeSidebar }
                              className={ ({ isActive }) =>
                                 `flex items-center gap-3 px-4 py-2 rounded-md my-1 font-medium transition-colors ${isActive
                                    ? 'bg-yellow-400 text-slate-900 font-semibold'
                                    : 'hover:bg-sky-500/20 hover:text-yellow-400'
                                 }`
                              }
                           >
                              { icon }
                              <span>{ label }</span>
                           </NavLink>
                        )) }
                     </nav>

                     <div className="p-4 border-t border-slate-700">
                        <button
                           onClick={ handleLogout }
                           className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-600 hover:text-white rounded-md transition"
                        >
                           <LogOut size={ 20 } />
                           <span>Logout</span>
                        </button>
                     </div>
                  </div>
               </motion.aside>
            ) }
         </AnimatePresence>

         {/* Sidebar for Desktop (static, no animation) */ }
         <aside className="hidden sm:flex sm:flex-col sm:static sm:w-64 h-screen sm:h-auto bg-[#0F172A] text-gray-200 z-40">
            {/* Logo */ }
            <div className="flex items-center justify-between p-6 text-yellow-400 font-bold text-2xl">
               <span>KLYNTFUND</span>
            </div>

            <div className="flex flex-col flex-1 min-h-0">
               <nav className="flex-1 overflow-y-auto px-4 pb-4">
                  { navItems.map(({ label, icon, path }) => (
                     <NavLink
                        key={ label }
                        to={ path }
                        className={ ({ isActive }) =>
                           `flex items-center gap-3 px-4 py-2 rounded-md my-1 font-medium transition-colors ${isActive
                              ? 'bg-yellow-400 text-slate-900 font-semibold'
                              : 'hover:bg-sky-500/20 hover:text-yellow-400'
                           }`
                        }
                     >
                        { icon }
                        <span>{ label }</span>
                     </NavLink>
                  )) }
               </nav>

               <div className="p-4 border-t border-slate-700">
                  <button
                     onClick={ handleLogout }
                     className="flex items-center gap-3 px-4 py-2 w-full text-red-400 hover:bg-red-600 hover:text-white rounded-md transition"
                  >
                     <LogOut size={ 20 } />
                     <span>Logout</span>
                  </button>
               </div>
            </div>
         </aside>
      </>
   );
};

export default Sidebar;
