import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Explicitly load .env file from the backend root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'ecommerce';
const apiKey = process.env.CLOUDINARY_API_KEY || '434476927848844';
const apiSecret =
  process.env.CLOUDINARY_API_SECRET || 'AJgNblyb--F5G_KPBooHmXAgxC4';


if (!cloudName || !apiKey || !apiSecret) {
  throw new Error(
    '❌ Missing Cloudinary environment variables. Check your .env file',
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});


export { cloudinary };
