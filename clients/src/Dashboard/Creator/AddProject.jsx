import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AddProject = () => {
   const { backendUrl, token } = useContext(AppContext);
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      title: '', category: '', thumbnail: null, thumbnailPreview: '',
      pitch: '', location: '', overview: '', problemSolution: '',
      goal: '', duration: '', minInvestment: '', impact: '',
      returnRate: '', repaymentPeriod: ''
   });

   const [loading, setLoading] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!token) {
         toast.warn("Login to Add Project");
         window.scrollTo(0, 0);
         return navigate('/login');
      }

      const projectData = new FormData();
      for (const key in formData) {
         if (key === "thumbnailPreview") continue;
         if (formData[key]) {
            projectData.append(key, formData[key]);
         }
      }

      try {
         setLoading(true);

         const { data } = await axios.post(`${backendUrl}/api/user/add-project`, projectData, {
            headers: { Authorization: `Bearer ${token}` }
         });

         if (data.success) {
            toast.success(data.message);
            setFormData({
               title: '', category: '', thumbnail: null, thumbnailPreview: '', returnRate: '', repaymentPeriod: '',
               pitch: '', location: '', overview: '', problemSolution: '',
               goal: '', duration: '', minInvestment: '', impact: ''
            });
         } else {
            toast.error(data.message);
         }

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   return (
      <motion.section
         initial={ { opacity: 0, y: 30 } }
         animate={ { opacity: 1, y: 0 } }
         className="max-w-5xl mx-auto bg-white shadow-md p-8 rounded-md mt-10 mb-20"
      >
         <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">Create a New Project</h2>

         <form onSubmit={ handleSubmit } className="space-y-8">
            {/* Basic Info */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" name="title" value={ formData.title } placeholder="Project Title" onChange={ handleChange } className="input" />
                  <input type="text" name="category" value={ formData.category } placeholder="Category" onChange={ handleChange } className="input" />
                  <div className="col-span-2">
                     <label className="block mb-1 font-medium">Project Thumbnail</label>
                     <div className="flex items-center space-x-4">
                        <label className="flex items-center cursor-pointer bg-gray-100 border border-dashed border-gray-400 px-4 py-2 rounded hover:bg-gray-200 transition">
                           <FaUpload className="mr-2 text-[#FACC15]" />
                           <span>Upload Image</span>
                           <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              name="thumbnail"
                              onChange={ (e) => {
                                 const file = e.target.files[0];
                                 if (file) {
                                    setFormData((prev) => ({
                                       ...prev,
                                       thumbnail: file,
                                       thumbnailPreview: URL.createObjectURL(file)
                                    }));
                                 }
                              } }
                           />
                        </label>

                        { formData.thumbnailPreview && (
                           <img
                              src={ formData.thumbnailPreview }
                              alt="Thumbnail Preview"
                              className="h-16 w-16 object-cover rounded border"
                           />
                        ) }
                     </div>
                  </div>

                  <input type="text" name="pitch" value={ formData.pitch } placeholder="Short Message" onChange={ handleChange } className="input" />
                  <input type="text" name="location" value={ formData.location } placeholder="Location" onChange={ handleChange } className="input" />
               </div>
            </div>

            {/* Details */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Details</h3>
               <textarea name="overview" value={ formData.overview } placeholder="Project Overview" onChange={ handleChange } className="input h-24" />
               <textarea name="problemSolution" value={ formData.problemSolution } placeholder="Problem & Proposed Solution" onChange={ handleChange } className="input h-24 mt-4" />
            </div>

            {/* Funding */ }
            <div className="grid md:grid-cols-3 gap-4">
               <input type="number" name="goal" value={ formData.goal } placeholder="Funding Goal (₵)" onChange={ handleChange } className="input" />
               <input type="number" name="duration" value={ formData.duration } placeholder="Duration (days)" onChange={ handleChange } className="input" />
               <input type="number" name="minInvestment" value={ formData.minInvestment } placeholder="Min. Investment (₵)" onChange={ handleChange } className="input" />
               <input type="number" name="returnRate" value={ formData.returnRate } placeholder="Return Rate (%)" onChange={ handleChange } className="input" />
               <input type="number" name="repaymentPeriod" value={ formData.repaymentPeriod } placeholder="Repayment Period (months)" onChange={ handleChange } className="input" />
            </div>

            {/* Impact */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Impact Statement</h3>
               <textarea name="impact" value={ formData.impact } placeholder="Describe expected impact..." onChange={ handleChange } className="input h-24" />
            </div>

            {/* Submit */ }
            <div className="text-right">
               <button
                  type="submit"
                  disabled={ loading }
                  className={ `bg-[#FACC15] text-[#0F172A] font-semibold px-6 py-2 rounded transition cursor-pointer
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'}` }
               >
                  { loading ? "Submitting..." : "Submit Project" }
               </button>
            </div>
         </form>
      </motion.section>
   );
};

export default AddProject;
