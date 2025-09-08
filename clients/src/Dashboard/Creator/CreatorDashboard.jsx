import React, { useContext } from 'react';
import { FaTachometerAlt, FaProjectDiagram, FaPlusCircle, FaUserCog, FaSignOutAlt } from 'react-icons/fa';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const sidebarLinks = [
   { label: 'Quick Stats', icon: <FaTachometerAlt size={ 25 } className="text-[#FACC15]" />, to: '/creator/dashboard' },
   { label: 'My Projects', icon: <FaProjectDiagram size={ 25 } className="text-[#FACC15]" />, to: '/creator/projects' },
   { label: 'Add New Project', icon: <FaPlusCircle size={ 25 } className="text-[#FACC15]" />, to: '/creator/add-new' },
   { label: 'Profile', icon: <FaUserCog size={ 25 } className="text-[#FACC15]" />, to: '/creator/profile' },
];

const CreatorDashboard = () => {
   const { setToken } = useContext(AppContext);
   const navigate = useNavigate();


   const logout = () => {
      setToken(false);
      localStorage.removeItem("token");
      navigate("/");
   };
   return (
      <div className="flex h-screen overflow-hidden bg-gray-100">
         {/* Sidebar */ }
         <aside className="bg-[#0F172A] text-white w-16 md:w-64 flex flex-col">
            <div className="p-4 text-center font-bold text-lg hidden md:block">
               Dashboard
            </div>
            <nav className="flex-1 flex flex-col space-y-2 mt-6 px-2 overflow-y-auto">
               { sidebarLinks.map((link, idx) => (
                  <NavLink
                     key={ idx }
                     to={ link.to }
                     onClick={ () => scrollTo(0, 0) }
                     className={ ({ isActive }) =>
                        `flex items-center md:justify-start justify-center space-x-4 py-3 px-3 rounded transition ${isActive
                           ? 'bg-[#1e293b] border-r-4 border-[#FACC15] font-semibold'
                           : 'hover:bg-[#1e293b]'
                        }`
                     }
                  >
                     <span className="text-xl">{ link.icon }</span>
                     <span className="hidden md:inline">{ link.label }</span>
                  </NavLink>
               )) }
               <div className="mb-4 mt-10 px-2">
                  <button onClick={ () => {
                     logout();
                     scrollTo(0, 0);
                  } } className="flex items-center md:justify-start justify-center text-red-400 hover:text-red-300 w-full px-3 py-2 rounded cursor-pointer">
                     <FaSignOutAlt className="text-lg" />
                     <span className="hidden md:inline ml-2">Logout</span>
                  </button>
               </div>
            </nav>
         </aside>

         {/* Main Content - scrolls independently */ }
         <div className="flex-1 h-full overflow-hidden">
            <main className="h-full overflow-y-auto p-6 scrollbar-hidden">
               <Outlet />
            </main>
         </div>
      </div>
   );

};

export default CreatorDashboard;
