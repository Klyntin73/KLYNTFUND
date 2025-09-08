import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

// configure cloudinary
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
});

//multer-storage-cloudinary for profile image upload
const profileImageStorage = new CloudinaryStorage({
   cloudinary,
   params: {
      folder: 'profund_profiles',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 200, height: 200, crop: 'fill' }]
   }
});

const uploadProfileImage = multer({ storage: profileImageStorage });

export default uploadProfileImage;
