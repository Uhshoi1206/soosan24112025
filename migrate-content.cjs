const fs = require('fs');
const path = require('path');

// Read all product TypeScript files and extract data
const productsBaseDir = path.join(__dirname, 'src/data/products');
const blogBaseDir = path.join(__dirname, 'src/data/blog-posts');

const productsOutputDir = path.join(__dirname, 'src/content/products');
const blogOutputDir = path.join(__dirname, 'src/content/blog');

// Ensure output directories exist
if (!fs.existsSync(productsOutputDir)) {
  fs.mkdirSync(productsOutputDir, { recursive: true });
}
if (!fs.existsSync(blogOutputDir)) {
  fs.mkdirSync(blogOutputDir, { recursive: true });
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else if (file.endsWith('.ts') && !file.includes('index.ts')) {
      arrayOfFiles.push(filePath);
    }
  });

  return arrayOfFiles;
}

// Manual conversion - read TS file and extract object literally
function convertTsToJson(tsFilePath, outputDir) {
  const content = fs.readFileSync(tsFilePath, 'utf-8');

  // Extract const variable declarations before the export
  const constMatches = content.matchAll(/const (\w+) = ['"](.*?)['"]/g);
  const constVars = {};
  for (const match of constMatches) {
    constVars[match[1]] = match[2];
  }

  // Extract the export statement
  const match = content.match(/export const \w+:\s*\w+\s*=\s*(\{[\s\S]*?\n\};)/);

  if (!match) {
    console.log(`⚠ Could not parse: ${tsFilePath}`);
    return false;
  }

  try {
    // Extract the object without the import statements
    let objectStr = match[1].replace(/\};$/, '}');

    // Use Function constructor with const variables
    const varDeclarations = Object.entries(constVars)
      .map(([key, val]) => `const ${key} = "${val}";`)
      .join('\n');

    const evalFunc = new Function(varDeclarations + '\nreturn ' + objectStr);
    const obj = evalFunc();

    if (obj && obj.id) {
      const outputPath = path.join(outputDir, `${obj.id}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(obj, null, 2));
      console.log(`✓ Converted: ${obj.id}`);
      return true;
    }
  } catch (error) {
    console.error(`Error converting ${path.basename(tsFilePath)}:`, error.message);
  }

  return false;
}

// Convert blog posts to Markdown
function convertBlogToMarkdown(tsFilePath, outputDir) {
  const content = fs.readFileSync(tsFilePath, 'utf-8');

  const match = content.match(/export const \w+:\s*\w+\s*=\s*(\{[\s\S]*?\n\};)/);

  if (!match) {
    console.log(`⚠ Could not parse: ${tsFilePath}`);
    return false;
  }

  try {
    let objectStr = match[1].replace(/\};$/, '}');

    const evalFunc = new Function('return ' + objectStr);
    const obj = evalFunc();

    if (obj && obj.id) {
      const { content: htmlContent, ...frontmatter } = obj;

      const markdown = `---
id: ${JSON.stringify(frontmatter.id)}
title: ${JSON.stringify(frontmatter.title)}
slug: ${JSON.stringify(frontmatter.slug)}
description: ${JSON.stringify(frontmatter.description)}
category: ${JSON.stringify(frontmatter.category)}
images: ${JSON.stringify(frontmatter.images)}
publishDate: ${frontmatter.publishDate}
readTime: ${frontmatter.readTime}
author: ${JSON.stringify(frontmatter.author)}
tags: ${JSON.stringify(frontmatter.tags || [])}
views: ${frontmatter.views || 0}
comments: ${frontmatter.comments || 0}
isHidden: false
---

${htmlContent || ''}
`;

      const outputPath = path.join(outputDir, `${frontmatter.slug}.md`);
      fs.writeFileSync(outputPath, markdown);
      console.log(`✓ Converted: ${frontmatter.id}`);
      return true;
    }
  } catch (error) {
    console.error(`Error converting ${tsFilePath}:`, error.message);
  }

  return false;
}

// Migrate products
console.log('=== Migrating Products ===');
const productFiles = getAllFiles(productsBaseDir);
let productCount = 0;
productFiles.forEach(file => {
  if (convertTsToJson(file, productsOutputDir)) {
    productCount++;
  }
});
console.log(`Products migrated: ${productCount}\n`);

// Migrate blog posts
console.log('=== Migrating Blog Posts ===');
const blogFiles = getAllFiles(blogBaseDir);
let blogCount = 0;
blogFiles.forEach(file => {
  if (convertBlogToMarkdown(file, blogOutputDir)) {
    blogCount++;
  }
});
console.log(`Blog posts migrated: ${blogCount}\n`);

console.log('✓ Migration complete!');
