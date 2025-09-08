import React, { useState, useContext, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import SearchBar from './SearchBar';

const Navbar = () => {
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
   const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
   const { token, setToken, setUserData, userData } = useContext(AppContext);
   const navigate = useNavigate();

   const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
   const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
   const toggleMobileSearch = () => setIsMobileSearchOpen(!isMobileSearchOpen);

   //Handle search bar close on mobile
   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth >= 768) {
            setIsMobileSearchOpen(false);
         }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      setToken(null);
      setUserData(null);
      setIsDropdownOpen(false);
      navigate('/');
   };

   const navLinks = [
      { name: 'Home', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'Blog', path: '/blog' },
   ];

   return (
      <header className="sticky top-0 z-50 bg-[#0F172A]">
         <div className="lg:px-20 px-4 py-4 flex items-center justify-between">
            {/* Logo */ }
            <Link to="/" onClick={ () => scrollTo(0, 0) } className="text-[#FACC15] text-2xl font-bold">
               <img src={ assets.logo } alt="logo" className="w-30 sm:w-20" />
            </Link>

            {/* Desktop Nav + Search */ }
            <nav className="hidden md:flex gap-8 items-center">
               { navLinks.map((link) => (
                  <NavLink
                     key={ link.name }
                     to={ link.path }
                     onClick={ () => scrollTo(0, 0) }
                     className={ ({ isActive }) =>
                        `text-white hover:text-[#FACC15] transition duration-200 font-medium ${isActive ? 'border-b-2 border-[#FACC15] text-yellow-400' : ''
                        }`
                     }
                  >
                     { link.name }
                  </NavLink>
               )) }

               {/* Desktop Search */ }
               <SearchBar />

               {/* Authenticated View */ }
               { token ? (
                  <div className="relative">
                     <FaUserCircle
                        className="text-white text-2xl cursor-pointer"
                        onClick={ toggleDropdown }
                     />
                     { isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 z-50">
                           <Link
                              to={ `/${userData?.role || 'investor'}/dashboard` }
                              onClick={ () => {
                                 setIsDropdownOpen(false);
                                 scrollTo(0, 0);
                              } }
                              className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                           >
                              Dashboard
                           </Link>
                           <button
                              onClick={ logout }
                              className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                           >
                              Logout
                           </button>
                        </div>
                     ) }
                  </div>
               ) : (
                  <Link
                     to="/login"
                     onClick={ () => scrollTo(0, 0) }
                     className="bg-[#FACC15] text-[#0F172A] font-semibold px-5 py-2 rounded-md hover:bg-yellow-400 transition"
                  >
                     Sign In
                  </Link>
               ) }
            </nav>

            {/* Mobile Menu Icons */ }
            <div className="flex gap-4 md:hidden text-white text-2xl items-center z-50">
               <FaSearch onClick={ toggleMobileSearch } className="cursor-pointer" />
               <button onClick={ toggleMobileMenu } aria-label="Toggle Menu">
                  { isMobileMenuOpen ? <FaTimes /> : <FaBars /> }
               </button>
            </div>
         </div>

         {/* Mobile Search */ }
         { isMobileSearchOpen && (
            <SearchBar isMobile={ true } closeMobileSearch={ () => setIsMobileSearchOpen(false) } />
         ) }

         {/* Mobile Backdrop */ }
         { isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
               onClick={ toggleMobileMenu }
            />
         ) }

         {/* Mobile Slide Menu */ }
         { isMobileMenuOpen && (
            <motion.div
               initial={ { x: '100%' } }
               animate={ { x: 0 } }
               exit={ { x: '100%' } }
               transition={ { duration: 0.3 } }
               className="fixed top-0 right-0 w-2/3 h-full bg-[#0F172A] p-6 z-40 md:hidden shadow-lg"
            >
               <ul className="flex flex-col gap-6 mt-16">
                  { navLinks.map((link) => (
                     <NavLink
                        key={ link.name }
                        to={ link.path }
                        onClick={ () => {
                           setIsMobileMenuOpen(false);
                           scrollTo(0, 0);
                        } }
                        className={ ({ isActive }) =>
                           `text-white hover:text-[#FACC15] transition duration-200 font-medium ${isActive ? 'border-b-2 border-[#FACC15] text-yellow-400' : ''
                           }`
                        }
                     >
                        { link.name }
                     </NavLink>
                  )) }

                  { token ? (
                     <>
                        <Link
                           to={ `/${userData?.role || 'investor'}/dashboard` }
                           onClick={ () => setIsMobileMenuOpen(false) }
                           className="text-white hover:text-yellow-400"
                        >
                           Dashboard
                        </Link>
                        <button
                           onClick={ () => {
                              logout();
                              setIsMobileMenuOpen(false);
                           } }
                           className="text-white hover:text-yellow-400 text-left"
                        >
                           Logout
                        </button>
                     </>
                  ) : (
                     <Link
                        to="/login"
                        onClick={ () => {
                           setIsMobileMenuOpen(false);
                           scrollTo(0, 0);
                        } }
                        className="block bg-[#FACC15] text-[#0F172A] text-center font-semibold py-2 rounded-md hover:bg-yellow-400 transition"
                     >
                        Sign In
                     </Link>
                  ) }
               </ul>
            </motion.div>
         ) }
      </header>
   );
};

export default Navbar;
