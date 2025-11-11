import { v2 as cloudinary } from 'cloudinary';
const cloudinaryClient = async () => {
    try {
      await cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
      });
    } catch (error) {
      throw new Error("Failed to connect to Cloudinary");
    }
  };
  
  export default cloudinaryClient;