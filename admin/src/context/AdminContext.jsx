import { useEffect } from "react";
import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
   const backendUrl = import.meta.env.VITE_ADMIN_BACKEND_URL;
   const currency = 'GHS';
   const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken") || null);

   const navigate = useNavigate();


   const handleLogout = () => {
      localStorage.removeItem("adminToken");
      setAdminToken(null);
      navigate('/login');
   };

   // ** Auto logout if token expires
   useEffect(() => {
      if (!adminToken) return;

      const decoded = JSON.parse(atob(adminToken.split('.')[1]));
      const expiry = decoded.exp * 1000;
      const timeout = expiry - Date.now();

      if (timeout <= 0) {
         handleLogout();
      } else {
         const timer = setTimeout(() => {
            handleLogout();
            toast.info('Session expired. Please login again.');
         }, timeout);

         return () => clearTimeout(timer);
      }
   }, [adminToken]);


   const value = {
      backendUrl, adminToken, setAdminToken,
      handleLogout, currency,
   };
   return (
      <AdminContext.Provider value={ value }>
         { props.children }
      </AdminContext.Provider>
   );
};

export default AdminContextProvider;