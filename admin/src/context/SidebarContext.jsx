import { createContext, useState } from 'react';

export const SidebarContext = createContext();

const SidebarProvider = (props) => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
   const closeSidebar = () => setIsSidebarOpen(false);

   return (
      <SidebarContext.Provider value={ { isSidebarOpen, toggleSidebar, closeSidebar } }>
         { props.children }
      </SidebarContext.Provider>
   );
};

export default SidebarProvider;