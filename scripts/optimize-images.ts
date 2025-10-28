#!/usr/bin/env tsx

/**
 * Optimize images in client/public to reduce website weight.
 *
 * Default behavior:
 * - Scans client/public recursively for PNG/JPG/JPEG/WEBP
 * - Skips SVG, MP4, icons, sitemap, robots
 * - Resizes images wider than maxWidth (default 1600px)
 * - Outputs AVIF and WEBP variants and an optimized original format
 * - Writes to client/public/optimized (mirrors directory structure)
 *
 * Usage examples:
 *   tsx scripts/optimize-images.ts
 *   tsx scripts/optimize-images.ts --input client/public --output client/public/optimized --maxWidth 1400 --quality 70
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

interface CliOptions {
  input: string;
  output: string;
  maxWidth: number;
  quality: number; // 1-100
  overwrite: boolean;
  dryRun: boolean;
}

const DEFAULTS: CliOptions = {
  input: 'client/public',
  output: 'client/public/optimized',
  maxWidth: 1600,
  quality: 75,
  overwrite: false,
  dryRun: false,
};

function parseArgs(argv: string[]): CliOptions {
  const args = new Map<string, string>();
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        args.set(key, next);
        i++;
      } else {
        args.set(key, 'true');
      }
    }
  }
  return {
    input: args.get('input') ?? DEFAULTS.input,
    output: args.get('output') ?? DEFAULTS.output,
    maxWidth: Number(args.get('maxWidth') ?? DEFAULTS.maxWidth),
    quality: Number(args.get('quality') ?? DEFAULTS.quality),
    overwrite: args.get('overwrite') === 'true',
    dryRun: args.get('dryRun') === 'true',
  };
}

const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

function shouldSkip(file: string): boolean {
  const lower = file.toLowerCase();
  if (lower.endsWith('.svg') || lower.endsWith('.mp4')) return true;
  if (lower.includes('favicon') || lower.includes('apple-touch-icon')) return true;
  if (lower.endsWith('sitemap.xml') || lower.endsWith('robots.txt')) return true;
  return false;
}

function walk(dir: string, exclude: string[] = []): string[] {
  const result: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const isExcluded = exclude.some((excluded) =>
      full === excluded || full.startsWith(`${excluded}${path.sep}`)
    );
    if (isExcluded) {
      continue;
    }
    if (entry.isDirectory()) {
      result.push(...walk(full, exclude));
    } else if (entry.isFile()) {
      result.push(full);
    }
  }
  return result;
}

async function ensureDir(dir: string): Promise<void> {
  await fs.promises.mkdir(dir, { recursive: true });
}

function formatBytes(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(1)} ${units[i]}`;
}

async function optimizeImage(srcPath: string, destBasePath: string, options: CliOptions): Promise<void> {
  const input = sharp(srcPath, { failOnError: false });
  const meta = await input.metadata();
  const width = meta.width ?? options.maxWidth;
  const resizeWidth = width > options.maxWidth ? options.maxWidth : width;

  const ext = path.extname(srcPath).toLowerCase();
  const baseName = path.basename(srcPath, ext);
  const dirName = path.dirname(destBasePath);
  await ensureDir(dirName);

  const pipeline = input.clone().resize({ width: resizeWidth, withoutEnlargement: true });

  const variants: Array<{ name: string; file: string; buffer: Buffer } | null> = [];

  if (options.dryRun) {
    console.log(`[dry-run] Would process: ${srcPath} -> ${destBasePath}`);
    return;
  }

  // WEBP
  {
    const webpBuffer = await pipeline.clone().webp({ quality: options.quality }).toBuffer();
    variants.push({ name: 'webp', file: path.join(dirName, `${baseName}.webp`), buffer: webpBuffer });
  }

  // AVIF
  {
    const avifBuffer = await pipeline.clone().avif({ quality: Math.max(1, Math.min(100, Math.round(options.quality * 0.9))) }).toBuffer();
    variants.push({ name: 'avif', file: path.join(dirName, `${baseName}.avif`), buffer: avifBuffer });
  }

  // Optimized original
  if (ext === '.jpg' || ext === '.jpeg') {
    const jpgBuffer = await pipeline.clone().jpeg({ quality: options.quality, mozjpeg: true }).toBuffer();
    variants.push({ name: 'jpeg', file: path.join(dirName, `${baseName}${ext}`), buffer: jpgBuffer });
  } else if (ext === '.png') {
    const pngBuffer = await pipeline.clone().png({ quality: options.quality, compressionLevel: 9 }).toBuffer();
    variants.push({ name: 'png', file: path.join(dirName, `${baseName}${ext}`), buffer: pngBuffer });
  } else if (ext === '.webp') {
    // Recompress webp
    const webpReBuffer = await pipeline.clone().webp({ quality: options.quality }).toBuffer();
    variants.push({ name: 'webp-orig', file: path.join(dirName, `${baseName}${ext}`), buffer: webpReBuffer });
  }

  // Write files and report sizes
  for (const v of variants) {
    if (!v) continue;
    if (!options.overwrite && fs.existsSync(v.file)) {
      // If existing, compare sizes and only overwrite if smaller
      const existingSize = fs.statSync(v.file).size;
      if (v.buffer.length >= existingSize) {
        console.log(`Skip (larger): ${path.relative(process.cwd(), v.file)} (${formatBytes(v.buffer.length)} >= ${formatBytes(existingSize)})`);
        continue;
      }
    }
    await fs.promises.writeFile(v.file, v.buffer);
    console.log(`Saved ${v.name}: ${path.relative(process.cwd(), v.file)} (${formatBytes(v.buffer.length)})`);
  }
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);
  const absInput = path.resolve(opts.input);
  const absOutput = path.resolve(opts.output);

  if (!fs.existsSync(absInput)) {
    console.error(`Input directory not found: ${absInput}`);
    process.exit(1);
  }

  if (absInput === absOutput) {
    console.error('Output directory must be different from input directory.');
    process.exit(1);
  }

  const excludeDirs: string[] = [];
  if (absOutput.startsWith(`${absInput}${path.sep}`)) {
    excludeDirs.push(absOutput);
  }

  const files = walk(absInput, excludeDirs)
    .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
    .filter((f) => !shouldSkip(f));

  if (files.length === 0) {
    console.log('No images found to optimize.');
    return;
  }

  console.log(`Optimizing ${files.length} image(s)...`);
  for (const file of files) {
    const rel = path.relative(absInput, file);
    const dest = path.join(absOutput, rel);
    try {
      await optimizeImage(file, dest, opts);
    } catch (e) {
      console.warn(`Failed to optimize ${rel}: ${(e as Error).message}`);
    }
  }
  console.log('Done.');
}

void main();


