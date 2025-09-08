import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const adminAuth = (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
   }

   const token = authHeader.split(' ')[1];

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!decoded?.isAdmin) {
         return res.status(403).json({ success: false, message: 'Access denied' });
      }

      req.admin = decoded;
      next();
   } catch (error) {
      console.error('JWT auth error:', error.message);
      res.status(403).json({ success: false, message: 'Invalid or expired token' });
   }
};
