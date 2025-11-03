#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, '..', 'dist', 'public');
const indexPath = path.join(distPath, 'index.html');

console.log('Pre-rendering site for SEO...');

// Read the built index.html
let html = fs.readFileSync(indexPath, 'utf-8');

// Inject static content that search engines can read
// This ensures Google sees your actual content
const seoContent = `
  <div id="seo-content" style="display:none;">
    <h1>Web Architects - Digital Experience Design</h1>
    <p>Creating exceptional digital experiences where precision meets creativity. Web & Mobile Applications, Digital Design, Creative Development.</p>
    
    <section>
      <h2>About Web Architects</h2>
      <p>We are a digital agency based in Athens, Greece, specializing in creating exceptional digital experiences.</p>
    </section>
    
    <section>
      <h2>Our Services</h2>
      <ul>
        <li>Web Development</li>
        <li>Mobile Application Development</li>
        <li>Digital Design</li>
        <li>User Experience Design</li>
        <li>Creative Development</li>
      </ul>
    </section>
    
    <section>
      <h2>Contact Us</h2>
      <p>Email: panos.hatzinikolaou@gmail.com</p>
      <p>Phone: +30 6986615255</p>
      <p>Location: Athens, Greece</p>
    </section>
  </div>
`;

// Inject the SEO content right after the opening body tag
html = html.replace('<body>', `<body>${seoContent}`);

// Write back to index.html
fs.writeFileSync(indexPath, html, 'utf-8');

console.log('Pre-rendering complete! SEO content injected.');
console.log('File updated:', indexPath);