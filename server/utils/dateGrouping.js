// **Utility for date grouping
export const getLastNDays = (n) => {
   const days = [];
   for (let i = n - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().slice(0, 10));
   }
   return days;
};