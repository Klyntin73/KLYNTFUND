import React from 'react';
import Header from '../components/Header';
import FeaturedProjects from '../components/FeaturedProjects';
import HowItWorks from '../components/HowItWorks';
import WhyInvest from '../components/WhyInvest';
import Testimonials from '../components/Testimonials';
import PlatformStats from '../components/PlatformStats';
import WhyKLYNTFUND from '../components/WhyKLYNTFUND';
import FinalCTA from '../components/FinalCTA';
import FAQ from '../components/FAQ';

const Home = () => {
   return (
      <div>
         <Header />
         <FeaturedProjects />
         <HowItWorks />
         <WhyInvest />
         <Testimonials />
         <PlatformStats />
         <WhyKLYNTFUND />
         <FinalCTA />
         <FAQ />
      </div>
   );
};

export default Home;
