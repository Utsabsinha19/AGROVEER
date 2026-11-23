import { Router, Request, Response } from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary strictly from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100 MB max for videos
  }
});

export const uploadRouter = Router();

// GET /api/upload/status - Test Cloudinary status
uploadRouter.get('/status', async (_req: Request, res: Response) => {
  try {
    const ping = await cloudinary.api.ping();
    res.json({
      success: true,
      status: 'connected',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      ping,
      message: 'Cloudinary connected successfully to Arveer Impex backend.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      status: 'error',
      message: error.message || 'Failed to connect to Cloudinary.'
    });
  }
});

// POST /api/upload - Upload single file (image or video)
uploadRouter.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded in form-data'
      });
    }

    const folder = (req.body.folder as string) || 'agrove_machinery';
    const resourceType = (req.body.resource_type as string) || 'auto';

    const result: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType as any,
          overwrite: true
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      uploadStream.end(req.file!.buffer);
    });

    res.json({
      success: true,
      message: 'Asset uploaded to Cloudinary successfully',
      data: {
        url: result.secure_url,
        secure_url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        resource_type: result.resource_type,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
        created_at: result.created_at,
      }
    });
  } catch (error: any) {
    console.error('Cloudinary Express upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Cloudinary upload failed'
    });
  }
});
