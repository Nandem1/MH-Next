const fs = require('fs');

function fixUseClient(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if file has "use client" but not at the top
    if (content.includes('"use client"') && !content.startsWith('"use client"')) {
      // Remove "use client" from wherever it is
      content = content.replace(/"use client";?\n?/g, '');
      
      // Add it at the very beginning
      content = '"use client";\n\n' + content;
      
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed use client: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
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

console.log('🔧 Fixing "use client" directive placement...');

const files = findTsFiles('src');
let fixedCount = 0;

files.forEach(file => {
  if (fixUseClient(file)) {
    fixedCount++;
  }
});

console.log(`✅ Fixed ${fixedCount} files.`); 