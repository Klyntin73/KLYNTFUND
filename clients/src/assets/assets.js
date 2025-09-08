import logo from './logo1.png';
import headerImg from './header-illustration.svg';
import solarImg from './solar-water.png';
import mobileImg from './mobile-health.png';
import droneImg from './drone.png';
import elearnImg from './e-learn.png';
import plasticImg from './plastic.png';
import smartImg from './smart_irrigation.jpeg';
import blog1 from './startup_teamwork.jpeg';
import blog2 from './e-learn.png';
import blog3 from './success.jpeg';
import team1 from './comm.jpeg';
import team2 from './relation.jpeg';
import team3 from './ceo.jpeg';
import team4 from './developer.jpeg';
import team5 from './designer.jpeg';
import team6 from './marketing.jpeg';
import testimony1 from './test1.jpeg';
import testimony2 from './test2.jpeg';
import testimony3 from './test3.jpeg';

export const assets = {
   logo,
   headerImg,
   blog1,
   blog2,
   blog3
};

// featured projects
export const projects = [
   {
      id: 1,
      title: 'Solar-Powered Water System',
      category: 'Clean Energy',
      thumbnail: solarImg,
      overview: 'This project aims to provide clean, sustainable drinking water to remote communities using solar-powered pumps and filtration systems.',
      pitch: 'Empowering communities with access to clean water through solar technology.',
      location: 'Upper East, Ghana',
      problemSolution: 'Problem: Contaminated water sources. Solution: Solar filtration systems to ensure clean drinking water.',
      goal: 120000,
      duration: 90,
      minInvestment: 100,
      impact: 'Reduced disease, improved quality of life, sustainable water access.',
      returnRate: 15,
      repaymentPeriod: '12 months',
   },
   {
      id: 2,
      title: 'Mobile Health Diagnostics',
      thumbnail: mobileImg,
      category: 'Health Tech',
      overview: 'A mobile health solution that brings diagnostics to rural and underserved areas.',
      pitch: 'Bringing vital health checks to communities without clinics.',
      location: 'Northern Region, Ghana',
      problemSolution: 'Problem: Poor rural healthcare. Solution: Mobile diagnostics units.',
      goal: 80000,
      duration: 60,
      minInvestment: 200,
      impact: 'Faster diagnoses, better health outcomes, reduced mortality.',
      returnRate: 12,
      repaymentPeriod: '10 months',
   },
   {
      id: 3,
      title: 'AgriTech Drone Solution',
      thumbnail: droneImg,
      category: 'Agriculture',
      overview: 'Utilizing drones to monitor crops, identify pest infestations early, and optimize irrigation.',
      pitch: 'High-tech farming for high-yield harvests.',
      location: 'Ashanti Region, Ghana',
      problemSolution: 'Problem: Inefficient farming. Solution: Drone surveillance and analytics.',
      goal: 95000,
      duration: 75,
      minInvestment: 150,
      impact: 'Higher yields, reduced pesticide use, climate-smart agriculture.',
      returnRate: 14,
      repaymentPeriod: '9 months',
   },
   {
      id: 4,
      title: 'E-learning for Rural Kids',
      thumbnail: elearnImg,
      category: 'Education',
      overview: 'Creating offline-friendly educational content for remote students.',
      pitch: 'Education without boundaries, powered by the sun.',
      location: 'Volta Region, Ghana',
      problemSolution: 'Problem: Lack of education in rural areas. Solution: Solar-powered tablets with offline content.',
      goal: 50000,
      duration: 60,
      minInvestment: 50,
      impact: 'Improved literacy, digital inclusion, future opportunities.',
      returnRate: 10,
      repaymentPeriod: '8 months',
   },
   {
      id: 5,
      title: 'Recycled Plastic Homes',
      thumbnail: plasticImg,
      category: 'Sustainable Living',
      overview: 'Transforming plastic waste into affordable housing.',
      pitch: 'Solving housing and plastic pollution with one solution.',
      location: 'Greater Accra, Ghana',
      problemSolution: 'Problem: Homelessness and plastic pollution. Solution: Eco-homes made from recycled plastic.',
      goal: 150000,
      duration: 120,
      minInvestment: 300,
      impact: 'Shelter for families, cleaner environment, job creation.',
      returnRate: 18,
      repaymentPeriod: '14 months',
   },
   {
      id: 6,
      title: 'Smart Irrigation Tech',
      category: 'AgriTech',
      thumbnail: smartImg,
      overview: 'An IoT-powered irrigation system that monitors soil moisture and weather.',
      pitch: 'Water-saving, yield-boosting smart irrigation.',
      location: 'Brong-Ahafo Region, Ghana',
      problemSolution: 'Problem: Water waste. Solution: Smart irrigation using IoT.',
      goal: 70000,
      duration: 50,
      minInvestment: 120,
      impact: 'Water conservation, higher crop productivity, smarter farming.',
      returnRate: 13,
      repaymentPeriod: '7 months',
   },
   {
      id: 7,
      title: 'Green Briquette Fuel',
      category: 'Clean Energy',
      thumbnail: '/images/green-briquette.jpg',
      overview: 'Converting agricultural waste into clean-burning fuel briquettes.',
      pitch: 'Clean fuel for cooking, made from waste.',
      location: 'Central Region, Ghana',
      problemSolution: 'Problem: Deforestation from firewood. Solution: Sustainable briquette fuel.',
      goal: 60000,
      duration: 65,
      minInvestment: 80,
      impact: 'Cleaner air, preserved forests, renewable energy.',
      returnRate: 11,
      repaymentPeriod: '9 months',
   },
   {
      id: 8,
      title: 'Women-Led Shea Cooperative',
      category: 'Social Enterprise',
      thumbnail: '/images/shea-coop.jpg',
      overview: 'Empowering women in rural communities to produce and export shea butter.',
      pitch: 'Fair trade, women empowerment, and sustainable income.',
      location: 'Upper West, Ghana',
      problemSolution: 'Problem: Gender inequality, unemployment. Solution: Women-led cooperatives.',
      goal: 45000,
      duration: 55,
      minInvestment: 60,
      impact: 'Women empowerment, export earnings, rural development.',
      returnRate: 9,
      repaymentPeriod: '6 months',
   },
   {
      id: 9,
      title: 'Eco-Tourism Trails',
      category: 'Tourism & Environment',
      thumbnail: '/images/eco-tourism.jpg',
      overview: 'Creating sustainable tourist trails to preserve Ghana’s forests and support local guides.',
      pitch: 'Tourism that protects nature and empowers locals.',
      location: 'Eastern Region, Ghana',
      problemSolution: 'Problem: Deforestation and youth unemployment. Solution: Eco-tourism jobs and awareness.',
      goal: 55000,
      duration: 70,
      minInvestment: 100,
      impact: 'Conservation, income generation, tourism boost.',
      returnRate: 10,
      repaymentPeriod: '9 months',
   },
   {
      id: 10,
      title: 'Fish Farm Expansion',
      category: 'Agribusiness',
      thumbnail: '/images/fish-farm.jpg',
      overview: 'Helping a local aquaculture business scale production and meet food demand.',
      pitch: 'Sustainable protein, local growth.',
      location: 'Western Region, Ghana',
      problemSolution: 'Problem: Protein shortage. Solution: Scalable fish farming.',
      goal: 90000,
      duration: 80,
      minInvestment: 200,
      impact: 'Food security, economic growth, youth employment.',
      returnRate: 16,
      repaymentPeriod: '10 months',
   },
];


// Team members
export const teamMembers = [
   {
      name: 'Isaac Loveland',
      role: 'Founder & CEO',
      img: team3,
      socials: {
         twitter: '#',
         linkedin: '#',
         github: '#',
      },
   },
   {
      name: 'Etornam Abletor',
      role: 'Lead Developer',
      img: team4,
      socials: {
         twitter: '#',
         linkedin: '#',
         github: '#',
      },
   },
   {
      name: 'Nana Adjei',
      role: 'Product Designer',
      img: team5,
      socials: {
         twitter: '#',
         linkedin: '#',
         github: '#',
      },
   },
   {
      name: 'Efua Asare',
      role: 'Community Manager',
      img: team1,
      socials: {
         twitter: '#',
         linkedin: '#',
         github: '#',
      },
   },
   {
      name: 'Yaw Antwi',
      role: 'Marketing Strategist',
      img: team6,
      socials: {
         twitter: '#',
         linkedin: '#',
         github: '#',
      },
   },
   {
      name: 'Akosua Dapaah',
      role: 'Investor Relations',
      img: team2,
      socials: {
         twitter: '#',
         linkedin: '#',
         github: '#',
      },
   },
];

// Testimonials
export const testimonials = [
   {
      name: 'Kwame Boateng',
      role: 'Creator',
      quote: '“KLYNTFUND gave my idea a life of its own. I got fully funded in just two weeks!”',
      avatar: testimony1,
   },
   {
      name: 'Amina Owusu',
      role: 'Investor',
      quote: '“I love seeing my investments help real people launch real projects. The transparency is top-notch.”',
      avatar: testimony2,
   },
   {
      name: 'Benjamin Kumi',
      role: 'Creator',
      quote: '“Easy to use and highly effective. I connected with investors who believed in my mission.”',
      avatar: testimony3,
   },
];

//Blog Post
export const blogPosts = [
   {
      id: 1,
      title: '5 Tips to Make Your Crowdfunding Project Stand Out',
      content: `Crowdfunding is not just about raising money—it's about telling a story. 
      A compelling story with the right visuals and strategy can elevate your campaign and connect you with the right audience.

      ✅ Tip 1: Clear Title and Summary
      ✅ Tip 2: Use Engaging Media
      ✅ Tip 3: Offer Realistic Rewards
      ✅ Tip 4: Leverage Social Media
      ✅ Tip 5: Update Frequently

      These strategies have helped thousands of creators hit their funding goals. You can too!
    `,
      summary: 'Learn how to create a compelling pitch, tell your story, and attract the right investors.',
      date: 'April 2025',
      image: blog1,
      tags: ['Crowdfunding', 'Tips'],

   },
   {
      id: 2,
      title: 'Why KLYNTFUND Uses Milestone-Based Funding',
      content: `Milestone-based funding is a safer, smarter approach. It ensures that project owners stay accountable and investors feel confident.

      💡 Funds are released in stages, aligned with project goals.
      💡 Admin verification ensures legitimacy.
      💡 Transparency increases trust.

      KLYNTFUND believes in trust-driven innovation—and milestone funding delivers just that.
    `,
      summary: 'Discover the benefits of milestone-based disbursement and how it protects investors and creators.',
      date: 'March 2025',
      image: blog2,
      tags: ['Security', 'Funding'],
   },
   {
      id: 3,
      title: 'Meet the Most Funded Project of This Month',
      content: `
      This month, the spotlight is on a groundbreaking health-tech project that raised over $100K in just 3 weeks.

      🚀 Built by a passionate team
      🤝 Backed by over 500 investors
      📈 Rapid growth and traction

      It’s proof that with the right idea and platform—anything is possible.
    `,
      summary:
         'Check out the story behind this month’s most successful campaign and how they reached their goal.',
      date: 'March 2025',
      image: blog3,
      tags: ['Success Story', 'Highlight'],
   },
];