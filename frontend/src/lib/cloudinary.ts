import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary strictly using environment variables
// Never hardcode credentials, API keys, or secrets in application source files
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[Security Warning] Missing Cloudinary environment variables. Please check your .env configuration.');
  }
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
