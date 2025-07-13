const fs = require('fs');
const path = require('path');

// Components that were incorrectly removed and need to be added back
const MISSING_COMPONENTS = {
  'src/app/dashboard/configuracion/page.tsx': ['Tabs', 'Tab'],
  'src/app/dashboard/nominas/page.tsx': ['Stack'],
  'src/app/dashboard/usuarios/page.tsx': ['Table', 'TableHead', 'TableRow', 'TableCell', 'TableBody'],
  'src/app/login/page.tsx': ['Link'],
  'src/app/register/page.tsx': ['Link'],
  'src/components/configuracion/ListaPreciosImporter.tsx': ['Card', 'FormControl', 'InputLabel', 'Select', 'MenuItem'],
  'src/components/dashboard/ActualizarEstadoVencimientoModal.tsx': ['FormControl', 'InputLabel', 'Select', 'MenuItem'],
  'src/components/dashboard/AsignarChequeModal.tsx': ['Stack'],
  'src/components/dashboard/CarteleriaCard.tsx': ['Card', 'CardContent'],
  'src/components/dashboard/CarteleriaSearchBar.tsx': ['FormControl', 'InputLabel', 'Select', 'MenuItem', 'Tooltip'],
  'src/components/dashboard/ControlVencimientosPageContent.tsx': ['Card', 'CardContent'],
  'src/components/dashboard/ControlVencimientosSearchBar.tsx': ['Tooltip', 'FormControl', 'InputLabel', 'Select', 'MenuItem'],
  'src/components/dashboard/ControlVencimientosTable.tsx': ['Tooltip', 'Card', 'CardContent'],
  'src/components/dashboard/FacturaCard.tsx': ['Card', 'CardContent', 'Stack', 'Tooltip'],
  'src/components/dashboard/FacturaSearchBar.tsx': ['Autocomplete'],
  'src/components/dashboard/FacturaTableDesktop.tsx': ['TableContainer', 'Table', 'TableHead', 'TableRow', 'TableCell', 'TableBody', 'Stack', 'Tooltip'],
  'src/components/dashboard/FiltroNominas.tsx': ['Stack', 'FormControl', 'InputLabel', 'Select', 'MenuItem'],
  'src/components/dashboard/NominaChequeTable.tsx': ['TableContainer', 'Table', 'TableHead', 'TableRow', 'TableCell', 'TableBody', 'Stack', 'Tooltip', 'Collapse'],
  'src/components/dashboard/NotaCreditoCard.tsx': ['Card', 'CardContent', 'Stack', 'Tooltip'],
  'src/components/dashboard/NotaCreditoSearchBar.tsx': ['Autocomplete'],
  'src/components/dashboard/NotaCreditoTableDesktop.tsx': ['TableContainer', 'Table', 'TableHead', 'TableRow', 'TableCell', 'TableBody', 'Stack', 'Tooltip', 'Collapse'],
  'src/components/dashboard/NuevaNominaChequeModal.tsx': ['Stack'],
  'src/components/dashboard/NuevoChequeModal.tsx': ['FormControl', 'InputLabel', 'Select', 'MenuItem'],
  'src/components/dashboard/TrackingEnvio.tsx': ['Stack', 'Stepper', 'Step', 'StepLabel', 'StepContent', 'FormControl', 'InputLabel', 'Select', 'MenuItem'],
  'src/components/dashboard/VencimientosSection.tsx': ['Collapse'],
  'src/components/layout/Sidebar.tsx': ['Toolbar', 'List', 'ListItem', 'ListItemButton', 'ListItemIcon', 'ListItemText', 'Collapse', 'MuiLink', 'Drawer'],
  'src/components/layout/Topbar.tsx': ['AppBar', 'Toolbar'],
  'src/components/movimientos/IngresoMovimientos.tsx': ['Card', 'TableContainer', 'Table', 'TableHead', 'TableRow', 'TableCell', 'TableBody'],
  'src/components/usuarios/NuevoUsuarioModal.tsx': ['Modal'],
  'src/components/zebra/ZebrAIGenerator.tsx': ['Card', 'CardContent', 'CardMedia']
};

function fixImports(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const missingComponents = MISSING_COMPONENTS[filePath];
    
    if (!missingComponents) {
      return false;
    }

    // Find the existing MUI imports
    const importRegex = /import\s+([^;]+)\s+from\s+["']@mui\/material[^"']*["'];?/g;
    let match;
    let hasMuiImport = false;
    let existingComponents = [];

    while ((match = importRegex.exec(content)) !== null) {
      hasMuiImport = true;
      const components = match[1].match(/\w+/g) || [];
      existingComponents = [...existingComponents, ...components];
    }

    // Add missing components
    const allComponents = [...new Set([...existingComponents, ...missingComponents])];
    
    if (hasMuiImport) {
      // Replace existing import
      content = content.replace(
        /import\s+([^;]+)\s+from\s+["']@mui\/material[^"']*["'];?/g,
        `import { ${allComponents.join(', ')} } from "@mui/material";`
      );
    } else {
      // Add new import at the top
      const importStatement = `import { ${allComponents.join(', ')} } from "@mui/material";\n`;
      content = importStatement + content;
    }

    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

console.log('🔧 Fixing broken MUI imports...');

let fixedCount = 0;
Object.keys(MISSING_COMPONENTS).forEach(filePath => {
  if (fixImports(filePath)) {
    fixedCount++;
  }
});

console.log(`✅ Fixed ${fixedCount} files.`); 