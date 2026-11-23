const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '..', '.next');
if (fs.existsSync(nextDir)) {
  try {
    fs.rmSync(nextDir, { recursive: true, force: true });
    console.log('✓ Cleaned .next build cache');
  } catch (err) {
    console.warn('⚠ Could not remove .next:', err.message);
  }
}

