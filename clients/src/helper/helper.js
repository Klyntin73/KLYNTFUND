// Animation
export const fadeIn = {
   hidden: { opacity: 0, y: 30 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
         delay: i * 0.1,
         duration: 0.5,
         ease: 'easeOut'
      }
   }),
};

export const cardVariants = {
   hidden: { opacity: 0, y: 20 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
   }),
};

export const fadeOut = {
   hidden: { opacity: 0, y: 40 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
   }),
};

export const fadeInUp = {
   hidden: { opacity: 0, y: 40 },
   visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2 },
   }),
};

// calculate days left
export const calculateDaysLeft = (createdAt, duration) => {
   const createdDate = new Date(createdAt);
   const expiryDate = new Date(createdDate.getTime() + duration * 24 * 60 * 60 * 1000);
   const now = new Date();
   const diff = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
   return diff > 0 ? diff : 0;
};

// formatNumber
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
