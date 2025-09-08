export const formatCurrencyAmount = (amount, currency = 'GHS') => {
   if (amount === null || amount === undefined) return `${currency} 0`;

   const absAmount = Math.abs(Number(amount));
   let formatted = '';

   if (absAmount >= 1_000_000_000) {
      formatted = (absAmount / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
   } else if (absAmount >= 1_000_000) {
      formatted = (absAmount / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
   } else if (absAmount >= 1_000) {
      formatted = (absAmount / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
   } else {
      formatted = absAmount.toString();
   }

   return `${currency} ${formatted}`;
};