import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUpload } from 'react-icons/fa';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const EditProject = () => {
   const { projectId } = useParams();
   const { backendUrl, token } = useContext(AppContext);
   const navigate = useNavigate();

   const [formData, setFormData] = useState({
      title: '', category: '', thumbnail: null, thumbnailPreview: '',
      pitch: '', location: '', overview: '', problemSolution: '',
      goal: '', duration: '', minInvestment: '', impact: '',
      returnRate: '', repaymentPeriod: ''
   });

   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchProject = async () => {
         try {
            const { data } = await axios.get(`${backendUrl}/api/user/get-project/${projectId}`, {
               headers: { Authorization: `Bearer ${token}` }
            });

            if (data.success && data.project) {
               const p = data.project;
               setFormData({
                  title: p.title || '',
                  category: p.category || '',
                  thumbnail: null,
                  thumbnailPreview: p.thumbnail || '',
                  pitch: p.pitch || '',
                  location: p.location || '',
                  overview: p.overview || '',
                  problemSolution: p.problemSolution || '',
                  goal: p.goal || '',
                  duration: p.duration || '',
                  minInvestment: p.minInvestment || '',
                  impact: p.impact || ''
               });
            } else {
               toast.error("Project not found.");
            }
         } catch (err) {
            toast.error("Failed to load project.");
            console.error(err);
         }
      };

      if (projectId) {
         fetchProject();
      }
   }, [projectId, backendUrl, token]);



   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      if (!token) {
         toast.warn("Login to edit project");
         return navigate('/login');
      }

      const updatedData = new FormData();
      for (const key in formData) {
         if (key === "thumbnailPreview") continue;
         if (key === "thumbnail" && formData.thumbnail) {
            updatedData.append('thumbnail', formData.thumbnail);
         } else if (key !== "thumbnail" && formData[key]) {
            updatedData.append(key, formData[key]);
         }
      }

      try {
         setLoading(true);

         const { data } = await axios.post(
            `${backendUrl}/api/user/edit-project/${projectId}`,
            updatedData,
            {
               headers: { Authorization: `Bearer ${token}` }
            }
         );

         if (data.success) {
            toast.success(data.message);
            navigate('/creator/dashboard');
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
         className="max-w-5xl bg-white shadow-md p-5 rounded-md mt-10 mb-20"
      >
         <h2 className="text-2xl font-bold mb-6 text-[#0F172A]">Edit Project</h2>

         <form onSubmit={ handleSubmit } className="space-y-8">
            {/* Basic Info */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Basic Info</h3>
               <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" name="title" value={ formData.title } onChange={ handleChange } className="input" placeholder="Project Title" />
                  <input type="text" name="category" value={ formData.category } onChange={ handleChange } className="input" placeholder="Category" />

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
                                    setFormData(prev => ({
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

                  <input type="text" name="pitch" value={ formData.pitch } onChange={ handleChange } className="input" placeholder="Short Message" />
                  <input type="text" name="location" value={ formData.location } onChange={ handleChange } className="input" placeholder="Location" />
               </div>
            </div>

            {/* Details */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Details</h3>
               <textarea name="overview" value={ formData.overview } onChange={ handleChange } className="input h-24" placeholder="Project Overview" />
               <textarea name="problemSolution" value={ formData.problemSolution } onChange={ handleChange } className="input h-24 mt-4" placeholder="Problem & Proposed Solution" />
            </div>

            {/* Funding */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Funding</h3>
               <div className="grid md:grid-cols-3 gap-4">
                  <input type="number" name="goal" value={ formData.goal } onChange={ handleChange } className="input" placeholder="Funding Goal (₵)" />
                  <input type="number" name="duration" value={ formData.duration } onChange={ handleChange } className="input" placeholder="Duration (days)" />
                  <input type="number" name="minInvestment" value={ formData.minInvestment } onChange={ handleChange } className="input" placeholder="Min. Investment (₵)" />
                  <input type="number" name="returnRate" value={ formData.returnRate } placeholder="Return Rate (%)" onChange={ handleChange } className="input" />
                  <input type="number" name="repaymentPeriod" value={ formData.repaymentPeriod } placeholder="Repayment Period (months)" onChange={ handleChange } className="input" />
               </div>
            </div>

            {/* Impact */ }
            <div>
               <h3 className="text-lg font-semibold mb-3">Impact Statement</h3>
               <textarea name="impact" value={ formData.impact } onChange={ handleChange } className="input h-24" placeholder="Describe expected impact..." />
            </div>

            {/* Submit */ }
            <div className="text-right">
               <button
                  type="submit"
                  disabled={ loading }
                  className={ `bg-[#FACC15] text-[#0F172A] font-semibold px-6 py-2 rounded transition cursor-pointer
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-yellow-400'}` }
               >
                  { loading ? "Updating..." : "Update Project" }
               </button>
            </div>
         </form>
      </motion.section>
   );
};

export default EditProject;
