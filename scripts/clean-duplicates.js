const fs = require('fs');

function cleanDuplicates(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Find all MUI imports
    const importRegex = /import\s*{([^}]+)}\s*from\s*["']@mui\/material["'];?/g;
    const matches = [];
    let match;

    while ((match = importRegex.exec(content)) !== null) {
      matches.push({
        fullMatch: match[0],
        components: match[1].split(',').map(c => c.trim())
      });
    }

    if (matches.length > 1) {
      // Combine all components and remove duplicates
      const allComponents = [...new Set(matches.flatMap(m => m.components))];
      
      // Remove all existing MUI imports
      content = content.replace(/import\s*{[^}]+}\s*from\s*["']@mui\/material["'];?\n?/g, '');
      
      // Add single combined import
      const combinedImport = `import { ${allComponents.join(', ')} } from "@mui/material";\n`;
      content = combinedImport + content;
      
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Cleaned: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error cleaning ${filePath}:`, error.message);
    return false;
  }
}

// Find all TypeScript/TSX files
function findTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = `${dir}/${item}`;
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findTsFiles(fullPath, files);
    } else if (stat.isFile() && /\.(ts|tsx)$/.test(item)) {
      files.push(fullPath);
    }
  }
  
  return files;
}

console.log('🧹 Cleaning duplicate MUI imports...');

const files = findTsFiles('src');
let cleanedCount = 0;

files.forEach(file => {
  if (cleanDuplicates(file)) {
    cleanedCount++;
  }
});

console.log(`✅ Cleaned ${cleanedCount} files.`); 