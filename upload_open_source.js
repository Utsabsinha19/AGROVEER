const fs = require('fs');
const path = require('path');
const https = require('https');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'ct7edeoo',
  api_key: '934886645915611',
  api_secret: 'esPcHh9GKecj7PvEzz2K9YmTyEE'
});

const openSourceAssets = [
  {
    id: 'open_source_earth_auger',
    filename: 'open-source-earth-auger.jpg',
    url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    title: 'Earth Auger Powerhead & Spiral Bit in Field Drilling'
  },
  {
    id: 'open_source_water_pump',
    filename: 'open-source-water-pump.jpg',
    url: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=1000&q=80',
    title: 'Centrifugal Agricultural Water Pump Irrigation'
  },
  {
    id: 'open_source_petrol_engine',
    filename: 'open-source-petrol-engine.jpg',
    url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1000&q=80',
    title: '170F Utility Engine with Power Drive'
  },
  {
    id: 'open_source_chainsaw_chain',
    filename: 'open-source-chainsaw-chain.jpg',
    url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1000&q=80',
    title: 'Precision Full-Chisel Chainsaw Timber Cutting'
  },
  {
    id: 'open_source_brush_cutter_tiller',
    filename: 'open-source-brush-cutter-tiller.jpg',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=1000&q=80',
    title: 'Brush Cutter Cultivator & 28mm Tiller Weeder'
  },
  {
    id: 'open_source_cordless_bag_closer',
    filename: 'open-source-cordless-bag-closer.jpg',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    title: 'Portable Grain Sack Bag Closure Packaging'
  },
  {
    id: 'open_source_trimmer_line',
    filename: 'open-source-trimmer-line.jpg',
    url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1000&q=80',
    title: 'Commercial Trimmer Line Precision Cut'
  }
];

const targetDir = path.join(__dirname, 'frontend/public/images/products');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

async function run() {
  const results = {};
  for (const asset of openSourceAssets) {
    try {
      console.log(`Processing: ${asset.title}...`);
      
      // 1. Upload to Cloudinary
      const cRes = await cloudinary.uploader.upload(asset.url, {
        folder: 'agrove_machinery/open_source',
        public_id: asset.id
      });
      console.log(`  Cloudinary URL: ${cRes.secure_url}`);
      
      // 2. Download locally for offline resilience
      const localPath = path.join(targetDir, asset.filename);
      await new Promise((resolve, reject) => {
        const file = fs.createWriteStream(localPath);
        https.get(cRes.secure_url, response => {
          response.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', err => {
          fs.unlink(localPath, () => {});
          reject(err);
        });
      });
      console.log(`  Saved locally: ${localPath}`);

      results[asset.id] = {
        cloudinaryUrl: cRes.secure_url,
        localPath: `/images/products/${asset.filename}`
      };
    } catch (err) {
      console.error(`  Error processing ${asset.id}:`, err.message);
    }
  }

  fs.writeFileSync(
    path.join(__dirname, 'frontend/src/data/openSourceMedia.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('Finished uploading and mapping open source media!');
}

run();
