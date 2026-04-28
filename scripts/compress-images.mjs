import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Load config
const config = JSON.parse(
  fs.readFileSync(path.join(import.meta.dirname, 'compress-config.json'), 'utf-8')
);

const sizeThresholdBytes = config.sizeThresholdMB * 1024 * 1024;
const inputDir = path.resolve(config.inputDir);

// Compression results tracking
const results = {
  compressed: [],
  skipped: [],
  errors: []
};

/**
 * Format bytes to human-readable size
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Get compression options based on format
 */
function getCompressionOptions(format) {
  const quality = config.quality[format] || 80;

  switch (format) {
    case 'jpeg':
    case 'jpg':
      return { mozjpeg: true, quality };
    case 'png':
      return { palette: true, quality, compressionLevel: 9 };
    case 'webp':
      return { quality };
    case 'avif':
      return { quality };
    default:
      return { quality };
  }
}

/**
 * Compress a single image file
 */
async function compressImage(filePath) {
  const originalSize = fs.statSync(filePath).size;
  const ext = path.extname(filePath).toLowerCase().slice(1);

  // Skip if under threshold
  if (originalSize < sizeThresholdBytes) {
    results.skipped.push({
      file: filePath,
      size: formatSize(originalSize),
      reason: 'Under threshold'
    });
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Determine output format
    let outputFormat = ext;
    if (config.convertToWebP && ext !== 'webp') {
      outputFormat = 'webp';
    }

    const options = getCompressionOptions(outputFormat);

    // Process image
    let processedImage = image;

    // Resize if too large (optional, can be configured)
    if (metadata.width && metadata.width > 2000) {
      processedImage = processedImage.resize(2000, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }

    // Apply format-specific compression
    if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
      processedImage = processedImage.jpeg(options);
    } else if (outputFormat === 'png') {
      processedImage = processedImage.png(options);
    } else if (outputFormat === 'webp') {
      processedImage = processedImage.webp(options);
    } else if (outputFormat === 'avif') {
      processedImage = processedImage.avif(options);
    }

    // Create temp file, then replace original
    const tempPath = filePath + '.tmp';
    await processedImage.toFile(tempPath);

    const newSize = fs.statSync(tempPath).size;
    const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

    // Replace original with compressed version
    fs.unlinkSync(filePath);
    fs.renameSync(tempPath, filePath);

    results.compressed.push({
      file: path.relative(inputDir, filePath),
      original: formatSize(originalSize),
      compressed: formatSize(newSize),
      savings: `${savings}%`
    });

  } catch (err) {
    results.errors.push({
      file: filePath,
      error: err.message
    });
  }
}

/**
 * Recursively scan directory for images
 */
function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  const imageFiles = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      imageFiles.push(...scanDirectory(filePath));
    } else {
      const ext = path.extname(file).toLowerCase().slice(1);
      if (config.extensions.includes(ext)) {
        imageFiles.push(filePath);
      }
    }
  }

  return imageFiles;
}

/**
 * Main compression process
 */
async function main() {
  console.log('\n🖼️  Image Compression Script\n');
  console.log(`📁 Input directory: ${inputDir}`);
  console.log(`📊 Size threshold: ${config.sizeThresholdMB} MB`);
  console.log(`🎯 Extensions: ${config.extensions.join(', ')}\n`);

  // Check if output directory exists
  if (!fs.existsSync(inputDir)) {
    console.error(`❌ Directory not found: ${inputDir}`);
    console.log('💡 Run "npm run build" first to generate the output directory.');
    process.exit(1);
  }

  // Find all images
  const imageFiles = scanDirectory(inputDir);
  console.log(`🔍 Found ${imageFiles.length} image files\n`);

  // Process images
  for (const file of imageFiles) {
    await compressImage(file);
  }

  // Print results
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📊 Compression Report:\n');

  if (results.compressed.length > 0) {
    console.log('✅ Compressed:');
    for (const r of results.compressed) {
      console.log(`   ${r.file}: ${r.original} → ${r.compressed} (${r.savings} saved)`);
    }
  }

  if (results.skipped.length > 0) {
    console.log('\n⏭️  Skipped (under threshold):');
    for (const r of results.skipped) {
      console.log(`   ${r.file}: ${r.size}`);
    }
  }

  if (results.errors.length > 0) {
    console.log('\n❌ Errors:');
    for (const r of results.errors) {
      console.log(`   ${r.file}: ${r.error}`);
    }
  }

  // Summary
  const totalOriginal = results.compressed.reduce((sum, r) => {
    const bytes = parseFloat(r.original.split(' ')[0]) *
      (r.original.includes('MB') ? 1024 * 1024 : 1024);
    return sum + bytes;
  }, 0);

  const totalCompressed = results.compressed.reduce((sum, r) => {
    const bytes = parseFloat(r.compressed.split(' ')[0]) *
      (r.compressed.includes('MB') ? 1024 * 1024 : 1024);
    return sum + bytes;
  }, 0);

  if (results.compressed.length > 0) {
    const totalSavings = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`\n📈 Summary:`);
    console.log(`   Files compressed: ${results.compressed.length}`);
    console.log(`   Files skipped: ${results.skipped.length}`);
    console.log(`   Files with errors: ${results.errors.length}`);
    console.log(`   Total saved: ${formatSize(totalOriginal - totalCompressed)} (${totalSavings}%)\n`);
  } else {
    console.log('\n📈 No files needed compression.\n');
  }
}

main().catch(err => {
  console.error('❌ Script failed:', err.message);
  process.exit(1);
});