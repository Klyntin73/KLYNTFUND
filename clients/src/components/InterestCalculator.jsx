import { useContext, useState } from 'react';
import { FaCalculator } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';

const InterestCalculator = ({ returnRate = 0, minInvestment = 0 }) => {
   const { currency } = useContext(AppContext);
   const [amount, setAmount] = useState(minInvestment);

   const handleInputChange = (e) => {
      const value = parseFloat(e.target.value);
      setAmount(isNaN(value) ? 0 : value);
   };

   const expectedReturn = amount * (1 + returnRate / 100);

   return (
      <div className="bg-white rounded-2xl shadow-lg p-6 mt-6 w-full max-w-md mx-auto border border-gray-100 transition duration-300 hover:shadow-xl">
         <div className="flex items-center mb-4">
            <FaCalculator className="text-blue-500 text-xl mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Interest Calculator</h2>
         </div>

         <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">
               Investment Amount({ currency })
            </label>
            <input
               type="number"
               value={ amount }
               onChange={ handleInputChange }
               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
               min={ 1 }
            />
         </div>

         <div className="text-sm text-gray-600 mb-2">
            <strong>Return Rate:</strong> { returnRate }%
         </div>

         <div className="bg-blue-50 text-blue-800 rounded-lg p-4 mt-4">
            <p className="text-sm">Estimated Return:</p>
            <p className="text-2xl font-bold">
               { currency }{ expectedReturn.toFixed(2) }
            </p>
         </div>
      </div>
   );
};

export default InterestCalculator;
