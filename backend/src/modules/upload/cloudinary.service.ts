import { Injectable } from '@nestjs/common';
import { cloudinary } from '../../lib/cloudinary.config.js';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'ecommerce/products',
          resource_type: 'auto',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            return reject(error);
          }
          if (!result) {
            return reject(new Error('Upload failed - no result returned'));
          }

          resolve(result.secure_url);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadImage(file));
    return Promise.all(uploadPromises);
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      if (publicId) {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
          console.warn(`Failed to delete image: ${imageUrl}`, result);
        }
      }
    } catch (error) {
      console.error(`Error deleting image: ${imageUrl}`, error);
    }
  }

  private extractPublicId(imageUrl: string): string | null {
    try {
      // Method 1: Extract from URL with folder structure
      // URL format: https://res.cloudinary.com/dxkaa5m0q/image/upload/v1773178476/ecommerce/products/ybyhycvkbhhqq9p07w3p.jpg

      // Remove version parameter (v123456) and get the path after /upload/
      const uploadIndex = imageUrl.indexOf('/upload/');
      if (uploadIndex === -1) {
        console.warn('❌ No /upload/ found in URL');
        return null;
      }

      const afterUpload = imageUrl.substring(uploadIndex + 8); // +8 to skip '/upload/'

      // Remove version if present (v123456/)
      const withoutVersion = afterUpload.replace(/^v\d+\//, '');

      // Remove file extension
      const publicId = withoutVersion.replace(/\.[^/.]+$/, '');

      return publicId;
    } catch (error) {
      console.error('❌ Error extracting public ID:', error);
      return null;
    }
  }
}
