/**
 * generate-book-covers.mjs
 * 
 * Generates book cover images for the Bible Library.
 * Each cover: 640x900 WebP with book name, section label, 
 * and section-specific accent color using brand palette.
 * 
 * Usage: node scripts/generate-book-covers.mjs
 * Output: website/public/covers/{ABBR}.webp
 */

import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const WEBSITE = join(__dirname, '..');
const OUT_DIR = join(WEBSITE, 'public', 'covers');
mkdirSync(OUT_DIR, { recursive: true });

// Brand colors
const CREAM = '#F5F1EB';
const CREAM_DARK = '#EDE6DA';
const GOLD = '#C9A227';
const GOLD_DARK = '#A68B0D';
const CHARCOAL = '#1A1A2E';
const CHARCOAL_LIGHT = '#4A4A5A';

// Section accent colors — warm, distinct, on-brand
const SECTION_COLORS = {
  'The Pentateuch':      { bg: '#1B3A5C', accent: '#C9A227', label: 'Pentateuch' },
  'Historical Books':    { bg: '#2E4A3A', accent: '#7FB069', label: 'History' },
  'Wisdom Literature':   { bg: '#5C3A1B', accent: '#D4A843', label: 'Wisdom' },
  'The Prophets':        { bg: '#4A1B3A', accent: '#C27BA0', label: 'Prophets' },
  'The Gospels':         { bg: '#3A1B1B', accent: '#D4694A', label: 'Gospels' },
  'Acts & Letters':      { bg: '#1B2A4A', accent: '#5B9BD5', label: 'Letters' },
  'The Apocrypha':       { bg: '#3A3A2E', accent: '#A89B6E', label: 'Deuterocanon' },
};

// Load library data
const libraryPath = join(WEBSITE, 'src', 'data', 'library.json');
const library = JSON.parse(readFileSync(libraryPath, 'utf-8'));

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSVG(bookName, sectionTitle, testament) {
  const colors = SECTION_COLORS[sectionTitle] || SECTION_COLORS['The Apocrypha'];
  const { bg, accent, label } = colors;
  
  // Compute font size — shorter names get larger text
  const nameLen = bookName.length;
  let fontSize = 52;
  if (nameLen <= 6) fontSize = 64;
  else if (nameLen <= 10) fontSize = 52;
  else if (nameLen <= 16) fontSize = 42;
  else if (nameLen <= 22) fontSize = 34;
  else fontSize = 28;

  // Subtle decorative cross element
  const crossY = 320;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="900" viewBox="0 0 640 900">
  <defs>
    <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${bg}" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="accent-line" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0"/>
      <stop offset="50%" stop-color="${accent}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="640" height="900" fill="${bg}"/>
  
  <!-- Subtle texture overlay -->
  <rect width="640" height="900" fill="url(#bg-grad)" opacity="0.3"/>
  
  <!-- Top accent line -->
  <rect x="120" y="80" width="400" height="2" fill="url(#accent-line)"/>

  <!-- Section label -->
  <text x="320" y="130" text-anchor="middle" 
        font-family="'Georgia','Times New Roman',serif" font-size="18" 
        letter-spacing="4" fill="${accent}" opacity="0.9">
    ${escapeXml(label.toUpperCase())}
  </text>

  <!-- Decorative cross -->
  <line x1="320" y1="${crossY - 50}" x2="320" y2="${crossY + 50}" 
        stroke="${accent}" stroke-width="1.5" opacity="0.25"/>
  <line x1="${320 - 30}" y1="${crossY - 15}" x2="${320 + 30}" y2="${crossY - 15}" 
        stroke="${accent}" stroke-width="1.5" opacity="0.25"/>

  <!-- Book name -->
  <text x="320" y="500" text-anchor="middle" 
        font-family="'Georgia','Times New Roman',serif" font-size="${fontSize}" 
        font-weight="normal" fill="#FFFFFF" letter-spacing="2">
    ${escapeXml(bookName)}
  </text>

  <!-- Subtitle: World English Bible -->
  <text x="320" y="555" text-anchor="middle" 
        font-family="'Georgia','Times New Roman',serif" font-size="16" 
        fill="#FFFFFF" opacity="0.5" letter-spacing="3">
    WORLD ENGLISH BIBLE
  </text>

  <!-- Bottom accent line -->
  <rect x="120" y="720" width="400" height="2" fill="url(#accent-line)"/>

  <!-- The Table Bible branding -->
  <text x="320" y="770" text-anchor="middle" 
        font-family="'Georgia','Times New Roman',serif" font-size="14" 
        fill="${accent}" opacity="0.7" letter-spacing="3">
    THE TABLE BIBLE
  </text>

  <!-- Corner accent marks -->
  <line x1="40" y1="40" x2="80" y2="40" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="40" y1="40" x2="40" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="600" y1="40" x2="560" y2="40" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="600" y1="40" x2="600" y2="80" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="40" y1="860" x2="80" y2="860" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="40" y1="860" x2="40" y2="820" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="600" y1="860" x2="560" y2="860" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  <line x1="600" y1="860" x2="600" y2="820" stroke="${accent}" stroke-width="1" opacity="0.3"/>
</svg>`;
}

async function generateCover(book, sectionTitle) {
  const svg = generateSVG(book.name, sectionTitle);
  const outPath = join(OUT_DIR, `${book.abbr}.webp`);
  
  await sharp(Buffer.from(svg))
    .webp({ quality: 85 })
    .toFile(outPath);
  
  return outPath;
}

async function main() {
  console.log('Generating book covers...\n');
  let count = 0;
  
  for (const section of library.sections) {
    console.log(`  ${section.title}`);
    for (const book of section.books) {
      const outPath = await generateCover(book, section.title);
      console.log(`    ✓ ${book.abbr} — ${book.name}`);
      count++;
    }
  }
  
  console.log(`\n✓ Generated ${count} book covers in website/public/covers/`);
}

main().catch(err => {
  console.error('Failed:', err);
  process.exit(1);
});
