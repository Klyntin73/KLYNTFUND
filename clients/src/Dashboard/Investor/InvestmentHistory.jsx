import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import ShimmerLoader from '../../components/ShimmerLoder';

const InvestmentHistory = () => {
   const { getInvestmentHistory, investmentHistory, currency } = useContext(AppContext);

   const [loading, setLoading] = useState(true);

   useEffect(() => {
      getInvestmentHistory().finally(() => setLoading(false));
   }, []);

   if (loading) {
      return (
         <div className="grid md:grid-cols-2 gap-6 mt-8">
            { Array.from({ length: 3 }).map((_, idx) => (
               <div key={ idx } className="p-5 rounded-lg shadow bg-white space-y-3">
                  <ShimmerLoader height="h-5" width="w-3/4" />
                  <ShimmerLoader height="h-4" width="w-1/2" />
                  <ShimmerLoader height="h-3" width="w-full" />
               </div>
            )) }
         </div>
      );
   }
   return (
      <div className="p-4">
         <h2 className="text-2xl font-semibold mb-4">Investment History</h2>

         { investmentHistory.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">No transactions yet.</div>
         ) : (
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
               <table className="min-w-full bg-white">
                  <thead className="bg-gray-100 text-gray-700 text-left text-sm">
                     <tr>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount { currency }</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Method</th>
                     </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800">
                     { investmentHistory.map((txn, index) => (
                        <tr key={ index } className="border-t border-gray-200">
                           <td className="px-4 py-3">{ new Date(txn.date).toLocaleDateString() }</td>
                           <td className="px-4 py-3 font-medium text-green-700">{ currency }{ txn.amount.toFixed(2) }</td>
                           <td className="px-4 py-3">{ txn.project }</td>
                           <td className="px-4 py-3">{ txn.method }</td>
                        </tr>
                     )) }
                  </tbody>
               </table>
            </div>
         ) }
      </div>
   );
};

export default InvestmentHistory;
