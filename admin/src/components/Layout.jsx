import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
   return (
      <div className="flex w-screen h-screen overflow-hidden">
         {/* Sidebar - already fixed via Sidebar component */ }
         <Sidebar />

         {/* Main content */ }
         <div className="flex flex-col flex-1 h-screen overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-[#F5F7FA]">
               <Outlet />
            </main>
         </div>
      </div>
   );
};

export default Layout;
