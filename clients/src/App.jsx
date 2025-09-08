import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import Home from './pages/Home';
import Contact from './pages/Contact';
import About from './pages/About';
import Blog from './pages/Blog';
import Projects from './pages/Projects';
import BlogDetail from './pages/BlogDetail';
import ProjectDetail from './pages/ProjectDetail';
import Investment from './pages/Investment';
import Login from './pages/Login';
import Register from './pages/Register';
import { ToastContainer } from 'react-toastify';

// Creator Dashboard
import CreatorDashboard from './Dashboard/Creator/CreatorDashboard';
import CreatorWelcome from './Dashboard/Creator/CreatorWelcome';
import QuickStats from './Dashboard/Creator/QuickStats';
import MyProjects from './Dashboard/Creator/MyProjects';
import AddProject from './Dashboard/Creator/AddProject';
import CreatorProfile from './Dashboard/Creator/CreatorProfile';

// Investor Dashboard
import InvestorDashboard from './Dashboard/Investor/InvestorDashboard';
import InvestorQuickStat from './Dashboard/Investor/InvestorQuickStat';
import MyInvestment from './Dashboard/Investor/MyInvestment';
import DiscoverProjects from './Dashboard/Investor/DiscoverProjects';
import InvestmentHistory from './Dashboard/Investor/InvestmentHistory';
import InvestorWelcome from './Dashboard/Investor/InvestorWelcome';
import InvestorProfile from './Dashboard/Investor/InvestorProfile';
import EditProject from './Dashboard/Creator/EditProject';
import SearchResults from './pages/SearchResults';

const App = () => {
   return (
      <div>
         <ToastContainer />
         <Navbar />
         <Routes>
            <Route path='/' element={ <Home /> } />
            <Route path='/projects' element={ <Projects /> } />
            <Route path='/projects/:id' element={ <ProjectDetail /> } />
            <Route path='/invest/:id' element={ <Investment /> } />
            <Route path='/contact' element={ <Contact /> } />
            <Route path='/about' element={ <About /> } />
            <Route path='/blog' element={ <Blog /> } />
            <Route path='/blog/:id' element={ <BlogDetail /> } />
            <Route path='/login' element={ <Login /> } />
            <Route path='/register' element={ <Register /> } />
            <Route path="/search" element={ <SearchResults /> } />

            {/* 🔹 Nested Creator Dashboard Routes */ }
            <Route path='/creator' element={ <CreatorDashboard /> }>
               <Route path='dashboard' element={
                  <>
                     <CreatorWelcome />
                     <QuickStats />
                  </>
               } />
               <Route path='projects' element={ <MyProjects /> } />
               <Route path="/creator/edit/:projectId" element={ <EditProject /> } />
               <Route path='add-new' element={ <AddProject /> } />
               <Route path='profile' element={ <CreatorProfile /> } />
            </Route>

            {/* 🔹 Nested Investor Dashboard Routes */ }
            <Route path='/investor' element={ <InvestorDashboard /> }>
               <Route path='dashboard' element={
                  <>
                     <InvestorWelcome />
                     <InvestorQuickStat />
                  </>
               } />
               <Route path='investments' element={ <MyInvestment /> } />
               <Route path='investment-history' element={ <InvestmentHistory /> } />
               <Route path='discover' element={ <DiscoverProjects /> } />
               <Route path='profile' element={ <InvestorProfile /> } />
            </Route>
         </Routes>
         <Footer />
      </div>
   );
};

export default App;
