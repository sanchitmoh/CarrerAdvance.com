// Script to update API URLs in route files to use environment variables
const fs = require('fs');
const path = require('path');

// Function to update a file
function updateFile(filePath) {
  try {
    // Read the file content
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file already imports getApiUrl
    const hasImport = content.includes("import { getApiUrl } from '@/lib/api-config'");
    
    // Add import if it doesn't exist
    if (!hasImport) {
      content = content.replace(
        /import [^;]+;(\s*)/,
        (match) => `${match}import { getApiUrl } from '@/lib/api-config';\n`
      );
    }
    
    // Replace hardcoded URLs with getApiUrl
    content = content.replace(
      /['`]http:\/\/localhost:8080\/index\.php\/api\/([^'`]+)['`]/g,
      (_, endpoint) => `getApiUrl('${endpoint}')`
    );
    
    // Replace template literals with backticks
    content = content.replace(
      /`http:\/\/localhost:8080\/index\.php\/api\/([^`]+)\${([^}]+)}([^`]*)`/g,
      (_, prefix, variable, suffix) => `getApiUrl(\`${prefix}\${${variable}}${suffix}\`)`
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
    return true;
  } catch (error) {
    console.error(`Error updating ${filePath}:`, error);
    return false;
  }
}

// Function to recursively find and update files in a directory
function processDirectory(directory) {
  const items = fs.readdirSync(directory, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(directory, item.name);
    
    if (item.isDirectory()) {
      processDirectory(fullPath);
    } else if (item.isFile() && (item.name.endsWith('.js') || item.name.endsWith('.ts'))) {
      updateFile(fullPath);
    }
  }
}

// Start processing from the API directory (resolve relative to project root)
// Use process.cwd() to avoid reliance on __dirname in edge-like environments
const projectRoot = process.cwd();
const apiDirectory = path.join(projectRoot, 'app', 'api');
processDirectory(apiDirectory);

console.log('API URL update completed!');


