#!/usr/bin/env node

/**
 * Script to fetch contact messages from the deployed website
 * Usage: node scripts/get-contacts.js <api-key> [url]
 */

const https = require('https');
const http = require('http');

const apiKey = process.argv[2];
const baseUrl = process.argv[3] || 'https://your-vercel-domain.com';

if (!apiKey) {
  console.error('Usage: node scripts/get-contacts.js <api-key> [url]');
  console.error('Example: node scripts/get-contacts.js your-secret-key https://webarchitectshq.vercel.app');
  process.exit(1);
}

const url = new URL('/api/contacts', baseUrl);
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

const options = {
  hostname: url.hostname,
  port: url.port || (isHttps ? 443 : 80),
  path: url.pathname,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'User-Agent': 'Contact-Fetcher/1.0'
  }
};

console.log(`Fetching contacts from ${url}...`);

const req = client.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (res.statusCode === 200) {
        console.log('\n✅ Successfully fetched contacts:');
        console.log('=====================================\n');
        
        if (response.length === 0) {
          console.log('No contact messages found.');
        } else {
          response.forEach((contact, index) => {
            console.log(`${index + 1}. ${contact.name} (${contact.email})`);
            console.log(`   Project Type: ${contact.projectType}`);
            console.log(`   Date: ${new Date(contact.createdAt).toLocaleString()}`);
            console.log(`   Message: ${contact.message}`);
            console.log('   ' + '-'.repeat(50));
          });
          
          console.log(`\nTotal: ${response.length} contact message(s)`);
        }
      } else {
        console.error(`❌ Error ${res.statusCode}:`);
        console.error(response.message || 'Unknown error');
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', error.message);
});

req.end();