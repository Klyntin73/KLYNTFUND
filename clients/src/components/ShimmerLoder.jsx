import React from 'react';

const ShimmerLoader = ({ height = 'h-6', width = 'w-full', rounded = 'rounded-md' }) => {
   return (
      <div
         className={`animate-pulse bg-gray-200 ${height} ${width} ${rounded}`}
      />
   );
};

export default ShimmerLoader;
