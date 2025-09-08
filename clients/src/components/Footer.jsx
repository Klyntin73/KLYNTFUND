import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaLinkedin, FaInstagram, FaFacebook } from 'react-icons/fa';
import { assets } from '../assets/assets';

const Footer = () => {
   return (
      <footer className="bg-[#0F172A] text-gray-300 py-12 px-6 md:px-12 lg:px-24">
         <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

            {/* Brand + About */ }
            <div>
               <img src={ assets.logo } alt="logo" className='w-38' />
               <p className="text-sm leading-relaxed">
                  KLYNTFUND is your gateway to fund, launch, and support world-changing ideas.
                  Join a growing community of innovators and investors.
               </p>
            </div>

            {/* Quick Links */ }
            <div>
               <h4 className="text-lg font-semibold text-white mb-2">Quick Links</h4>
               <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="hover:text-yellow-400" onClick={ () => scrollTo(0, 0) }>About</Link></li>
                  <li><Link to="/contact" className="hover:text-yellow-400" onClick={ () => scrollTo(0, 0) }>Contact</Link></li>
                  <li><Link to="/privacy" className="hover:text-yellow-400" onClick={ () => scrollTo(0, 0) }>Privacy Policy</Link></li>
                  <li><Link to="/terms" className="hover:text-yellow-400" onClick={ () => scrollTo(0, 0) }>Terms & Conditions</Link></li>
               </ul>
            </div>

            {/* Social Links */ }
            <div>
               <h4 className="text-lg font-semibold text-white mb-2">Connect With Us</h4>
               <div className="flex space-x-4 mt-3">
                  <a href="#" className="hover:text-yellow-400"><FaTwitter size={ 20 } /></a>
                  <a href="#" className="hover:text-yellow-400"><FaLinkedin size={ 20 } /></a>
                  <a href="#" className="hover:text-yellow-400"><FaInstagram size={ 20 } /></a>
                  <a href="#" className="hover:text-yellow-400"><FaFacebook size={ 20 } /></a>
               </div>
            </div>

            {/* Newsletter or CTA (optional) */ }
            <div>
               <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
               <p className="text-sm mb-3">Subscribe to get the latest updates on projects and funding opportunities.</p>
               <form className="flex">
                  <input
                     type="email"
                     placeholder="Enter your email"
                     className="px-3 py-2 rounded-l-md text-sm w-full text-white border border-white bg-[#1E293B] focus:outline-none"
                     required
                  />
                  <button
                     type="submit"
                     className="bg-yellow-400 text-[#0F172A] px-4 py-2 rounded-r-md text-sm font-semibold hover:bg-yellow-300 transition"
                  >
                     Subscribe
                  </button>
               </form>
            </div>
         </div>

         <div className="border-t border-gray-600 mt-10 pt-6 text-sm text-center">
            &copy; { new Date().getFullYear() } KLYNTFUND. All rights reserved.
         </div>
      </footer>
   );
};

export default Footer;
