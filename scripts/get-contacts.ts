#!/usr/bin/env tsx

/**
 * Script to fetch contact messages from the deployed website (TypeScript)
 * Usage: tsx scripts/get-contacts.ts <api-key> <url> [bypass-token]
 */

import https from 'https';
import http from 'http';

interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  projectType: string;
  message: string;
  createdAt: string | number | Date;
}

const apiKey = process.argv[2];
const baseUrl = process.argv[3];
const bypassToken = process.argv[4];

if (!apiKey || !baseUrl) {
  console.error('Usage: tsx scripts/get-contacts.ts <api-key> <url> [bypass-token]');
  console.error('Example: tsx scripts/get-contacts.ts your-secret-key https://webarchitectshq.vercel.app');
  console.error('With bypass: tsx scripts/get-contacts.ts your-secret-key https://webarchitectshq.vercel.app your-bypass-token');
  process.exit(1);
}

const url = new URL('/api/contacts', baseUrl);

// Add bypass token if provided
if (bypassToken) {
  url.searchParams.set('x-vercel-protection-bypass', bypassToken);
}
const isHttps = url.protocol === 'https:';
const client = isHttps ? https : http;

const options: https.RequestOptions & http.RequestOptions = {
  hostname: url.hostname,
  port: url.port ? Number(url.port) : (isHttps ? 443 : 80),
  path: `${url.pathname}${url.search}`,
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'User-Agent': 'Contact-Fetcher/1.0',
    'Accept': 'application/json'
  }
};

console.log(`Fetching contacts from ${url.toString()}...`);

const req = client.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data) as unknown;

      if (res.statusCode === 200) {
        const records = Array.isArray(response) ? (response as ContactMessage[]) : [];
        console.log('\n✅ Successfully fetched contacts:');
        console.log('=====================================\n');
        
        if (records.length === 0) {
          console.log('No contact messages found.');
        } else {
          records.forEach((contact, index) => {
            const date = new Date(contact.createdAt);
            console.log(`${index + 1}. ${contact.name} (${contact.email})`);
            console.log(`   Project Type: ${contact.projectType}`);
            console.log(`   Date: ${isNaN(date.getTime()) ? String(contact.createdAt) : date.toLocaleString()}`);
            console.log(`   Message: ${contact.message}`);
            console.log('   ' + '-'.repeat(50));
          });
          
          console.log(`\nTotal: ${records.length} contact message(s)`);
        }
      } else {
        const err = (response as any)?.message || 'Unknown error';
        console.error(`❌ Error ${res.statusCode}:`);
        console.error(err);
      }
    } catch (error) {
      console.error('❌ Failed to parse response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request failed:', (error as Error).message);
});

req.end();


