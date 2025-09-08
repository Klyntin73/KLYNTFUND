import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';

import Layout from './components/Layout';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Setting from './pages/settings/Setting';
import FeedbackList from './pages/feedbacks/FeedbackList';

import Project from './pages/projects/Project';
import PendingProjects from './pages/projects/PendingProjects';
import ViewProjectDetails from './pages/projects/ViewProjectDetails';
import ApprovedProjects from './pages/projects/ApprovedProjects';
import RejectedProjects from './pages/projects/RejectedProjects';
import CompletedProjects from './pages/projects/CompletedProjects';

import Investments from './pages/investments/Investments';
import AllInvestments from './pages/investments/AllInvestments';
import ViewInvestmentDetail from './pages/investments/ViewInvestmentDetail';
import FlaggedInvestments from './pages/investments/FlaggedInvestments';
import RefundInvestment from './pages/investments/RefundInvestment';
import DisputedInvestment from './pages/investments/DisputedInvestment';
import UsersList from './pages/users/UsersList';
import UserProfile from './pages/users/UserProfile';

const App = () => {
   const { adminToken } = useContext(AdminContext);
   return adminToken ? (
      <div>
         <ToastContainer theme='dark' />
         <Routes>
            <Route path="/" element={ <Navigate to="/admin/dashboard" /> } />

            <Route path="/admin" element={ <Layout /> }>
               <Route path="dashboard" element={ <Dashboard /> } />
               <Route path="feedbacks" element={ <FeedbackList /> } />
               <Route path="settings" element={ <Setting /> } />

               {/* Project Routes */ }
               <Route path="projects" element={ <Project /> } />
               <Route path='/admin/projects/pending' element={ <PendingProjects /> } />
               <Route path='/admin/projects/approved' element={ <ApprovedProjects /> } />
               <Route path='/admin/projects/rejected' element={ <RejectedProjects /> } />
               <Route path='/admin/projects/completed' element={ <CompletedProjects /> } />
               <Route path='/admin/projects/view/:id' element={ <ViewProjectDetails /> } />

               {/* Investment Routes */ }
               <Route path="investments" element={ <Investments /> } />
               <Route path='/admin/investments/all' element={ <AllInvestments /> } />
               <Route path='/admin/investment/view/:projectId/:paymentRef' element={ <ViewInvestmentDetail /> } />
               <Route path='/admin/investments/flagged' element={ <FlaggedInvestments /> } />
               <Route path='/admin/investments/refunds' element={ <RefundInvestment /> } />
               <Route path='/admin/investments/disputed' element={ <DisputedInvestment /> } />

               {/* User Routes  */ }
               <Route path="users" element={ <UsersList /> } />
               <Route path='/admin/user/:id' element={ <UserProfile /> } />
            </Route>
         </Routes>
      </div>
   ) : (
      <>
         <ToastContainer theme="dark" />
         <Login />
      </>
   );
};

export default App;
