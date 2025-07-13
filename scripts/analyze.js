const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

console.log('🔍 Starting bundle analysis...');

// Paths
const originalConfigPath = path.join(__dirname, '..', 'next.config.ts');
const analyzerConfigPath = path.join(__dirname, '..', 'next.config.analyze.js');
const backupConfigPath = path.join(__dirname, '..', 'next.config.backup.ts');

try {
  // Backup original config
  console.log('📋 Backing up original config...');
  fs.copyFileSync(originalConfigPath, backupConfigPath);
  
  // Copy analyzer config to main config
  console.log('📝 Setting up analyzer config...');
  const analyzerConfig = fs.readFileSync(analyzerConfigPath, 'utf8');
  
  // Convert to TypeScript format
  const tsConfig = analyzerConfig
    .replace('const withBundleAnalyzer = require', '// eslint-disable-next-line @typescript-eslint/no-var-requires\nconst withBundleAnalyzer = require')
    .replace('module.exports =', 'export default');
  
  fs.writeFileSync(originalConfigPath, tsConfig);
  
  // Run the build
  console.log('🏗️  Running build with bundle analyzer...');
  
  const buildProcess = spawn('npx', ['next', 'build'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Bundle analysis complete!');
      console.log('📊 Check your browser for the analysis reports.');
    } else {
      console.error(`❌ Build failed with code ${code}`);
    }
    
    // Restore original config
    console.log('🔄 Restoring original config...');
    if (fs.existsSync(backupConfigPath)) {
      fs.copyFileSync(backupConfigPath, originalConfigPath);
      fs.unlinkSync(backupConfigPath);
    }
  });
  
} catch (error) {
  console.error('❌ Error during bundle analysis:', error.message);
  
  // Restore original config on error
  if (fs.existsSync(backupConfigPath)) {
    fs.copyFileSync(backupConfigPath, originalConfigPath);
    fs.unlinkSync(backupConfigPath);
  }
} 