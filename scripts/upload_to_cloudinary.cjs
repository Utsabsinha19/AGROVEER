require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary strictly from environment variables without printing secrets
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const MANIFEST_FILE = path.join(__dirname, '..', 'cloudinary_manifest.json');

// Folders to scan for media
const TARGET_DIRS = [
  path.join(__dirname, '..', 'frontend', 'public', 'images', 'products'),
  path.join(__dirname, '..', 'frontend', 'public', 'videos'),
  path.join(__dirname, '..', 'frontend', 'public'),
  path.join(__dirname, '..', 'backend', 'source', 'images'),
  path.join(__dirname, '..', 'backend', 'source', 'videos')
];

const VALID_IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
const VALID_VIDEO_EXTS = ['.mp4', '.mov', '.webm'];

function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Don't recurse into node_modules, build directories, or .git
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== '.next') {
        getFilesRecursively(fullPath, fileList);
      }
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_IMAGE_EXTS.includes(ext) || VALID_VIDEO_EXTS.includes(ext)) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

async function uploadFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isVideo = VALID_VIDEO_EXTS.includes(ext);
  const baseName = path.basename(filePath, ext);
  const cleanPublicId = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Determine subfolder based on location
  const normPath = filePath.replace(/\\/g, '/');
  let folder = 'agrove_assets/general';
  if (isVideo) {
    folder = 'agrove_assets/videos';
  } else if (normPath.includes('/products/')) {
    folder = 'agrove_assets/products';
  } else if (normPath.includes('/backend/source/')) {
    folder = 'agrove_assets/source_media';
  } else if (normPath.includes('logo')) {
    folder = 'agrove_assets/brand';
  }

  const options = {
    folder: folder,
    public_id: cleanPublicId,
    resource_type: isVideo ? 'video' : 'image',
    overwrite: true
  };

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, options, (error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result);
    });
  });
}

async function run() {
  console.log('========================================================');
  console.log('🚀 Starting Automated Cloudinary Media Upload...');
  console.log(`📡 Cloudinary Target: ${process.env.CLOUDINARY_CLOUD_NAME || 'configured'}`);
  console.log('========================================================\n');

  // Verify connection first
  try {
    const ping = await cloudinary.api.ping();
    console.log('✅ Cloudinary API Connection Verified:', ping.status);
  } catch (err) {
    console.error('❌ Cloudinary connection failed:', err.message);
    process.exit(1);
  }

  // Collect all unique media files
  const fileSet = new Set();
  for (const targetDir of TARGET_DIRS) {
    const files = getFilesRecursively(targetDir);
    for (const file of files) {
      fileSet.add(path.resolve(file));
    }
  }

  const allFiles = Array.from(fileSet);
  console.log(`📁 Found ${allFiles.length} media files (images & videos) ready for upload.\n`);

  // Load existing manifest if any
  let manifest = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    } catch {
      manifest = {};
    }
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < allFiles.length; i++) {
    const file = allFiles[i];
    const fileName = path.basename(file);
    const relPath = path.relative(path.join(__dirname, '..'), file).replace(/\\/g, '/');
    const isVideo = VALID_VIDEO_EXTS.includes(path.extname(file).toLowerCase());
    const typeLabel = isVideo ? '🎥 VIDEO' : '🖼️  IMAGE';

    if (manifest[relPath] && manifest[relPath].secure_url) {
      console.log(`[${i + 1}/${allFiles.length}] ${typeLabel}: ${fileName} ... ⚡ Already uploaded -> ${manifest[relPath].secure_url}`);
      successCount++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${allFiles.length}] ${typeLabel}: ${fileName} ... `);

    try {
      const result = await uploadFile(file);
      manifest[relPath] = {
        public_id: result.public_id,
        secure_url: result.secure_url,
        resource_type: result.resource_type,
        bytes: result.bytes,
        format: result.format,
        width: result.width,
        height: result.height,
        duration: result.duration || null,
        uploaded_at: new Date().toISOString()
      };
      successCount++;
      console.log(`✅ Uploaded (${(result.bytes / 1024).toFixed(1)} KB)`);
    } catch (err) {
      errorCount++;
      console.log(`❌ Failed: ${err.message}`);
    }

    // Save manifest incrementally
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2), 'utf8');
  }

  console.log('\n========================================================');
  console.log(`🎉 Cloudinary Bulk Upload Completed!`);
  console.log(`✅ Successfully Uploaded: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📄 Asset Manifest Saved: ${MANIFEST_FILE}`);
  console.log('========================================================');
}

run().catch(console.error);
