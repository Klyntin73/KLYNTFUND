import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import SidebarProvider from './context/SidebarContext.jsx';
import AdminContextProvider from './context/AdminContext.jsx';

createRoot(document.getElementById('root')).render(

   <BrowserRouter>
      <AdminContextProvider>
         <SidebarProvider>
            <App />
         </SidebarProvider>
      </AdminContextProvider>
   </BrowserRouter>
);
