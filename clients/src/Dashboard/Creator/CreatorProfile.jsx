import React, { useState, useEffect, useContext } from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaSave, FaEdit, FaUpload } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';

const CreatorProfile = () => {
   const { backendUrl, token, userData, getUserProfile } = useContext(AppContext);
   const [profile, setProfile] = useState({
      fullName: '',
      email: '',
      location: '',
      bio: '',
      twitter: '',
      linkedin: '',
      imageUrl: '',
   });

   const [image, setImage] = useState(null);
   const [imageFile, setImageFile] = useState(null);
   const [isEditing, setIsEditing] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   useEffect(() => {
      setProfile(userData);
   }, [userData]);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setProfile(prev => ({ ...prev, [name]: value }));
   };

   const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
         setImage(URL.createObjectURL(file));
         setImageFile(file);
      }
   };

   const toggleEditMode = () => {
      setIsEditing(prev => !prev);
   };

   const handleSaveProfile = async () => {
      setIsLoading(true);
      try {
         const formData = new FormData();
         formData.append('fullName', profile.fullName);
         formData.append('email', profile.email);
         formData.append('location', profile.location);
         formData.append('bio', profile.bio);
         formData.append('twitter', profile.twitter);
         formData.append('linkedin', profile.linkedin);
         if (image) {
            formData.append('profileImage', imageFile);
         }

         // Send a request to update the profile
         const { data } = await axios.post(`${backendUrl}/api/user/update-profile`, formData, {
            headers: { Authorization: `Bearer ${token}` }
         });

         if (data.success) {
            await getUserProfile();
            toast.success(data.message);
            setIsEditing(false);
            setImage(null);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <motion.section
         initial={ { opacity: 0, y: 40 } }
         animate={ { opacity: 1, y: 0 } }
         transition={ { duration: 0.6 } }
         className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 mb-20"
      >
         <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">Your Profile</h2>

         <div className="grid md:grid-cols-2 gap-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
               <div className="flex items-center bg-gray-100 rounded px-3">
                  <FaUser className="text-gray-400 mr-2" />
                  <input
                     type="text"
                     name="fullName"
                     value={ profile.fullName }
                     onChange={ handleChange }
                     disabled={ !isEditing }
                     className="bg-transparent w-full py-2 outline-none"
                  />
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
               <div className="flex items-center bg-gray-100 rounded px-3">
                  <FaEnvelope className="text-gray-400 mr-2" />
                  <input
                     type="email"
                     name="email"
                     value={ profile.email }
                     onChange={ handleChange }
                     disabled={ !isEditing }
                     className="bg-transparent w-full py-2 outline-none"
                  />
               </div>
            </div>

            <div className="">
               <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
               <div className="flex items-center bg-gray-100 rounded px-3">
                  <FaMapMarkerAlt className="text-gray-400 mr-2" />
                  <input
                     type="text"
                     name="location"
                     value={ profile.location }
                     onChange={ handleChange }
                     disabled={ !isEditing }
                     className="bg-transparent w-full py-2 outline-none"
                  />
               </div>
            </div>

            <div className="flex items-center space-x-4 mt-4.5 sm:mt-auto">
               <label className="flex items-center cursor-pointer bg-gray-100 border border-dashed border-gray-400 px-4 py-2 rounded hover:bg-gray-200 transition">
                  <FaUpload className="mr-2 text-[#FACC15]" />
                  <span>Profile Picture</span>
                  <input
                     type="file"
                     accept="image/*"
                     onChange={ handleImageChange }
                     disabled={ !isEditing }
                     className="hidden"
                  />
               </label>
               { image && (
                  <img
                     src={ image }
                     alt="Profile Preview"
                     className="mt-3 h-24 w-24 object-cover rounded-full"
                  />
               ) }
               { profile.imageUrl && !image && !isEditing && (
                  <img
                     src={ profile.imageUrl }
                     alt="Profile"
                     className="mt-3 h-24 w-24 object-cover rounded-full"
                  />
               ) }
            </div>

            <div className="md:col-span-2">
               <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
               <textarea
                  name="bio"
                  value={ profile.bio }
                  onChange={ handleChange }
                  disabled={ !isEditing }
                  rows={ 4 }
                  className="w-full bg-gray-100 rounded px-3 py-2 outline-none"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
               <input
                  type="text"
                  name="twitter"
                  value={ profile.twitter }
                  onChange={ handleChange }
                  disabled={ !isEditing }
                  className="w-full bg-gray-100 rounded px-3 py-2 outline-none"
               />
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
               <input
                  type="text"
                  name="linkedin"
                  value={ profile.linkedin }
                  onChange={ handleChange }
                  disabled={ !isEditing }
                  className="w-full bg-gray-100 rounded px-3 py-2 outline-none"
               />
            </div>
         </div>

         <button
            onClick={ isEditing ? handleSaveProfile : toggleEditMode }
            className={ `mt-6 flex items-center gap-2  transition text-[#0F172A] font-medium py-2 px-5 rounded cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'bg-[#FACC15] hover:bg-yellow-400'}` }
         >
            { isLoading
               ? <span className="animate-spin border-2 border-t-transparent border-[#0F172A] rounded-full w-4 h-4" />
               : isEditing ? <FaSave /> : <FaEdit />
            }
            { isLoading ? 'Saving...' : isEditing ? 'Save Profile' : 'Edit Profile' }
         </button>
      </motion.section>
   );
};

export default CreatorProfile;
