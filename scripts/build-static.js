// Static build script for traditional hosting
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building static version for traditional hosting...');

// Build the project
execSync('npm run build', { stdio: 'inherit' });

// Copy static files to a deployment folder
const deployDir = 'deploy-static';
const publicDir = 'dist/public';

// Remove existing deploy directory
if (fs.existsSync(deployDir)) {
  fs.rmSync(deployDir, { recursive: true });
}

// Copy public files
fs.cpSync(publicDir, deployDir, { recursive: true });

// Create a simple contact form replacement
const contactFormReplacement = `
<div style="padding: 2rem; text-align: center; background: #f5f5f5; border-radius: 1rem; margin: 2rem 0;">
  <h3>Contact Us</h3>
  <p>Email us directly at: <a href="mailto:panos.hatzinikolaou@gmail.com">panos.hatzinikolaou@gmail.com</a></p>
  <p>Phone: <a href="tel:+306986615255">+30 6986615255</a></p>
</div>
`;

console.log('Static build complete!');
console.log('Files ready in: ' + deployDir);
console.log('Upload the contents of this folder to your hosting provider');
