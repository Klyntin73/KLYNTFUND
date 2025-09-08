import { useNavigate } from "react-router-dom";
import { ArrowLeft, Handshake } from "lucide-react";

const DisputedInvestment = () => {
   const navigate = useNavigate();
   return (
      <div>
         <button
            onClick={ () => {
               navigate(-1);
               scrollTo(0, 0);
            } }
            className="flex items-center gap-1 mb-6 text-sm text-gray-500 hover:text-gray-700"
         >
            <ArrowLeft className="w-4 h-4 text-[#3498DB]" /> Back
         </button>
         <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-[#3498DB]">
            <Handshake className="w-6 h-6" />
            Disputed Investments
         </h1>
         <div className="flex justify-center">
            <p>Under Develpoment</p>
         </div>
      </div>
   );
};

export default DisputedInvestment;
