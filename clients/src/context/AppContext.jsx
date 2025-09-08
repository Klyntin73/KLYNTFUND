import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
   const currency = "GHS";
   const backendUrl = import.meta.env.VITE_BACKEND_URL;

   const [token, setToken] = useState(localStorage.getItem("token") || null);
   const [userData, setUserData] = useState(false);
   const [dashProject, setDashProject] = useState([]);
   const [dashStats, setDashStats] = useState(null);
   const [projects, setProjects] = useState([]);
   const [investorStats, setInvestorStats] = useState(null);
   const [investorInvestments, setInvestorInvestments] = useState(null);
   const [investmentHistory, setInvestmentHistory] = useState(null);

   // **Get Dashbord Stats for Creator**
   const getCreatorDashboardStats = async () => {
      try {

         const { data } = await axios.get(`${backendUrl}/api/user/creator/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         if (data.success) {
            setDashStats(data.dashStats);
         } else {
            toast.error(data.message);
         }

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   };

   // ** GET Investor Stats
   const getInvestorDashboardStats = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/investments/investor-stats`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         data.success ? setInvestorStats(data.investorStat) : toast.error(data.message);
      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   };

   // **Get Investor Investment
   const getInvestorInvestments = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/investments/my-investment`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         data.success ? setInvestorInvestments(data.investments) : toast.error(data.message);

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   };

   // **Get Dashboard Project**
   const getDashProject = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/my-project`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         data.success ? setDashProject(data.projects) : toast.error(data.message);

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   };

   // **Get Investment History**
   const getInvestmentHistory = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/investments/investment-history`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         data.success ? setInvestmentHistory(data.history) : toast.error(data.message);

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   };

   // **Get User Profile**
   const getUserProfile = async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` }
         });

         if (data.success) {
            setUserData(data.userData);
         } else {
            toast.error(data.message);
         }

      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   };

   // **Get All Projects**
   const getAllProjects = useCallback(async () => {
      try {
         const { data } = await axios.get(`${backendUrl}/api/user/projects`);
         if (data.success) {
            setProjects(data.projects);
         } else {
            toast.error(data.message);
         }
      } catch (error) {
         toast.error(error.response?.data?.message || "Something went wrong");
         console.error(error);
      }
   }, [backendUrl]);


   useEffect(() => {
      getAllProjects();
   }, [getAllProjects]);

   useEffect(() => {
      if (token) {
         getUserProfile();
         getCreatorDashboardStats();
         getInvestorDashboardStats();
      }
   }, [token]);


   const value = {
      currency, backendUrl,
      token, setToken,
      userData, setUserData, getUserProfile,
      dashProject, setDashProject, getDashProject,
      getCreatorDashboardStats, dashStats, setDashStats,
      getInvestorDashboardStats, investorStats, setInvestorStats,
      getAllProjects, setProjects, projects,
      getInvestorInvestments, investorInvestments, setInvestorInvestments,
      getInvestmentHistory, investmentHistory, setInvestmentHistory,
   };


   return (
      <AppContext.Provider value={ value }>
         { props.children }
      </AppContext.Provider>
   );
};

export default AppContextProvider;