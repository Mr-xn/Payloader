#!/usr/bin/env node

/**
 * Build Standalone HTML
 * 
 * This script takes the Vite build output (dist/) and inlines all CSS and JS
 * into a single self-contained HTML file that can be opened directly in any
 * browser without a web server or Node.js.
 * 
 * Usage: node scripts/build-standalone.js
 * Output: Payloader.html (in project root)
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');
const distDir = join(rootDir, 'dist');

function buildStandalone() {
  // Read the built index.html
  const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf-8');

  // Find all CSS and JS files in dist/assets/
  const assets = readdirSync(join(distDir, 'assets'));
  const cssFiles = assets.filter(f => f.endsWith('.css'));
  const jsFiles = assets.filter(f => f.endsWith('.js'));

  let html = indexHtml;

  // Inline CSS: replace <link rel="stylesheet" ...> with <style>...</style>
  for (const cssFile of cssFiles) {
    const cssContent = readFileSync(join(distDir, 'assets', cssFile), 'utf-8')
      .replace(/@import\s+(?:url\()?(["'])https?:\/\/[^"')]+\1\)?;\s*/g, '');
    const linkRegex = new RegExp(`<link[^>]*href=["']\\./assets/${cssFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*>`, 'g');
    // Use function replacement to avoid $& expansion in replacement string
    html = html.replace(linkRegex, () => `<style>${cssContent}</style>`);
  }

  // Inline JS while preserving module-script timing so the app mounts after #root exists.
  for (const jsFile of jsFiles) {
    const jsContent = readFileSync(join(distDir, 'assets', jsFile), 'utf-8');
    const scriptRegex = new RegExp(`<script[^>]*src=["']\\./assets/${jsFile.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'][^>]*><\\/script>`, 'g');
    // Use a classic script for file:// compatibility, but defer execution until the DOM is ready.
    // The Vite bundle is fully self-contained with no ES module imports.
    // Use function replacement to avoid $& expansion in replacement string
    html = html.replace(
      scriptRegex,
      () => `<script>(function(){const run=()=>{${jsContent}};if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",run,{once:true});}else{run();}})();</script>`
    );
  }

  // Write the standalone HTML file
  const outputPath = join(rootDir, 'Payloader.html');
  writeFileSync(outputPath, html, 'utf-8');

  const sizeKB = (Buffer.byteLength(html, 'utf-8') / 1024).toFixed(1);
  console.log(`✅ Standalone HTML built successfully!`);
  console.log(`   Output: Payloader.html (${sizeKB} KB)`);
  console.log(`   Open this file directly in any browser - no server needed.`);
}

try {
  buildStandalone();
} catch (err) {
  console.error('❌ Build failed:', err.message);
  process.exit(1);
}
