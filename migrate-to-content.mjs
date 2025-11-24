import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to recursively find all .ts files
function findTsFiles(dir, fileList = []) {
  const files = readdirSync(dir);

  files.forEach(file => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isDirectory()) {
      findTsFiles(filePath, fileList);
    } else if (file.endsWith('.ts') && !file.includes('index.ts')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Extract object from TypeScript file
function extractObjectFromTs(content, varName) {
  // Remove imports and exports
  const cleanContent = content
    .replace(/^import .*$/gm, '')
    .replace(/^export /gm, '');

  // Find the object declaration
  const regex = new RegExp(`const\\s+${varName}\\s*[:=]\\s*\\{`, 'g');
  const match = regex.exec(cleanContent);

  if (!match) return null;

  let braceCount = 1;
  let start = match.index + match[0].length;
  let end = start;

  // Find matching closing brace
  for (let i = start; i < cleanContent.length; i++) {
    if (cleanContent[i] === '{') braceCount++;
    if (cleanContent[i] === '}') braceCount--;
    if (braceCount === 0) {
      end = i;
      break;
    }
  }

  const objectContent = '{' + cleanContent.substring(start, end) + '}';

  // Try to evaluate it as JavaScript (dangerous but works for our use case)
  try {
    // Replace template literals and clean up
    const evalContent = objectContent
      .replace(/`([^`]*)`/g, (match, p1) => {
        return JSON.stringify(p1.replace(/\$\{[^}]+\}/g, ''));
      });

    return eval('(' + evalContent + ')');
  } catch (e) {
    console.error('Error parsing object:', e.message);
    return null;
  }
}

// Migrate products
function migrateProducts() {
  const productsDir = join(__dirname, 'src/data/products');
  const outputDir = join(__dirname, 'src/content/products');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const productFiles = findTsFiles(productsDir);
  let migratedCount = 0;

  productFiles.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Extract variable name from export (e.g., export const hyundaiPorter = ...)
      const exportMatch = content.match(/export const (\w+):/);
      if (!exportMatch) {
        console.log(`Skipping ${filePath} - no export found`);
        return;
      }

      const varName = exportMatch[1];
      const productData = extractObjectFromTs(content, varName);

      if (productData && productData.id) {
        const outputPath = join(outputDir, `${productData.id}.json`);
        writeFileSync(outputPath, JSON.stringify(productData, null, 2));
        migratedCount++;
        console.log(`✓ Migrated: ${productData.id}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });

  console.log(`\nProducts migrated: ${migratedCount}`);
}

// Migrate blog posts
function migrateBlogPosts() {
  const blogDir = join(__dirname, 'src/data/blog-posts');
  const outputDir = join(__dirname, 'src/content/blog');

  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  const blogFiles = findTsFiles(blogDir);
  let migratedCount = 0;

  blogFiles.forEach(filePath => {
    try {
      const content = readFileSync(filePath, 'utf-8');

      // Extract variable name
      const exportMatch = content.match(/export const (\w+):/);
      if (!exportMatch) {
        console.log(`Skipping ${filePath} - no export found`);
        return;
      }

      const varName = exportMatch[1];
      const blogData = extractObjectFromTs(content, varName);

      if (blogData && blogData.id) {
        // Extract frontmatter and content
        const { content: htmlContent, ...frontmatter } = blogData;

        // Create markdown file with frontmatter
        const markdown = `---
id: "${frontmatter.id}"
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
description: "${frontmatter.description.replace(/"/g, '\\"')}"
category: "${frontmatter.category}"
images: ${JSON.stringify(frontmatter.images)}
publishDate: ${frontmatter.publishDate}
readTime: ${frontmatter.readTime}
author: "${frontmatter.author}"
tags: ${JSON.stringify(frontmatter.tags || [])}
views: ${frontmatter.views || 0}
comments: ${frontmatter.comments || 0}
isHidden: false
---

${htmlContent || ''}
`;

        const outputPath = join(outputDir, `${frontmatter.slug}.md`);
        writeFileSync(outputPath, markdown);
        migratedCount++;
        console.log(`✓ Migrated: ${frontmatter.id}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });

  console.log(`\nBlog posts migrated: ${migratedCount}`);
}

// Run migrations
console.log('Starting migration to Astro Content Collections...\n');
console.log('=== Migrating Products ===');
migrateProducts();
console.log('\n=== Migrating Blog Posts ===');
migrateBlogPosts();
console.log('\n✓ Migration complete!');
