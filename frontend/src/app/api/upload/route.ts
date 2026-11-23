import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs'; // Use nodejs runtime for streaming upload
export const dynamic = 'force-dynamic';

// GET: Check Cloudinary connection status
export async function GET() {
  try {
    const res = await cloudinary.api.ping();
    return NextResponse.json({
      success: true,
      status: 'connected',
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      ping: res,
      message: 'Cloudinary API connection is active and authenticated.'
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        status: 'error',
        message: error.message || 'Failed to ping Cloudinary API.'
      },
      { status: 500 }
    );
  }
}

// POST: Upload image or video to Cloudinary
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle multipart form data (direct file upload)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      const folder = (formData.get('folder') as string) || 'agrove_machinery';
      const resourceType = (formData.get('resource_type') as string) || 'auto';

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'No file provided in form data' },
          { status: 400 }
        );
      }

      // Convert Web File to Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload via Cloudinary upload_stream
      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: resourceType as any,
            overwrite: true,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

      return NextResponse.json({
        success: true,
        message: 'File successfully uploaded to Cloudinary',
        data: {
          url: uploadResult.secure_url,
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type,
          bytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration, // If video
          created_at: uploadResult.created_at,
        }
      });
    }

    // Handle JSON payload (base64 string or remote URL upload)
    if (contentType.includes('application/json')) {
      const body = await req.json();
      const { file, folder = 'agrove_machinery', resource_type = 'auto' } = body;

      if (!file) {
        return NextResponse.json(
          { success: false, message: 'Missing file (base64 or URL) in request body' },
          { status: 400 }
        );
      }

      const uploadResult = await cloudinary.uploader.upload(file, {
        folder,
        resource_type: resource_type as any,
        overwrite: true,
      });

      return NextResponse.json({
        success: true,
        message: 'Asset successfully uploaded to Cloudinary',
        data: {
          url: uploadResult.secure_url,
          secure_url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          resource_type: uploadResult.resource_type,
          bytes: uploadResult.bytes,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration,
          created_at: uploadResult.created_at,
        }
      });
    }

    return NextResponse.json(
      { success: false, message: 'Unsupported Content-Type. Use multipart/form-data or application/json' },
      { status: 415 }
    );
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'An error occurred during Cloudinary upload'
      },
      { status: 500 }
    );
  }
}
