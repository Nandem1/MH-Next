const fs = require('fs');
const path = require('path');

// MUI components that are commonly imported
const MUI_COMPONENTS = [
  'Box', 'Typography', 'Paper', 'TextField', 'Button', 'Grid', 'Alert', 'AlertTitle',
  'CircularProgress', 'Divider', 'IconButton', 'Dialog', 'DialogTitle', 'DialogContent',
  'DialogActions', 'Chip', 'Container', 'Snackbar', 'Pagination', 'Skeleton'
];

// Recursively find all TypeScript/TSX files
function findTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTsFiles(fullPath, files);
    } else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function optimizeImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Find bulk imports from @mui/material
    const bulkImportRegex = /import\s*{([^}]+)}\s*from\s*["']@mui\/material["'];?/g;
    let match;

    while ((match = bulkImportRegex.exec(content)) !== null) {
      const components = match[1]
        .split(',')
        .map(c => c.trim())
        .filter(c => MUI_COMPONENTS.includes(c));

      if (components.length > 0) {
        // Replace with individual imports
        const individualImports = components
          .map(comp => `import ${comp} from "@mui/material/${comp}";`)
          .join('\n');

        content = content.replace(match[0], individualImports);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Optimized: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files
const files = findTsFiles('src');

console.log('🔧 Starting MUI import optimization...');
console.log(`📁 Found ${files.length} files to process`);

let optimizedCount = 0;

files.forEach(file => {
  if (optimizeImports(file)) {
    optimizedCount++;
  }
});

console.log(`✅ Import optimization complete! Optimized ${optimizedCount} files.`); 