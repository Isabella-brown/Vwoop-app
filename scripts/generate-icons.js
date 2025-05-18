const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const sourceIcon = path.join(__dirname, '../assets/images/appicon.png');
const outputDir = path.join(__dirname, '../android/app/src/main/res');

async function generateIcons() {
  try {
    // Create mipmap directories if they don't exist
    for (const density of Object.keys(sizes)) {
      const dir = path.join(outputDir, `mipmap-${density}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Generate icons for each density
    for (const [density, size] of Object.entries(sizes)) {
      const outputPath = path.join(outputDir, `mipmap-${density}`, 'ic_launcher.png');
      const roundOutputPath = path.join(outputDir, `mipmap-${density}`, 'ic_launcher_round.png');

      // Generate regular icon
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(outputPath);

      // Generate round icon
      await sharp(sourceIcon)
        .resize(size, size)
        .toFile(roundOutputPath);

      console.log(`Generated ${density} icons (${size}x${size})`);
    }

    console.log('Icon generation complete!');
  } catch (error) {
    console.error('Error generating icons:', error);
  }
}

generateIcons(); 