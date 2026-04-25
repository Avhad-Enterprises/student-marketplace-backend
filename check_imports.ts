import fs from 'fs';
import path from 'path';

const serverTsPath = 'c:/Projects/student-marketplace-backend-v2/src/server.ts';
const content = fs.readFileSync(serverTsPath, 'utf8');

const importRegex = /import.*?from\s+['"](.*?)['"]/g;
let match;
const missingFiles = [];

while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
        // Relative import
        const fullPath = path.resolve(path.dirname(serverTsPath), importPath);
        const extensions = ['.ts', '.tsx', '/index.ts', '/index.tsx', '.js', '.jsx'];
        let found = false;
        for (const ext of extensions) {
            if (fs.existsSync(fullPath + ext)) {
                found = true;
                break;
            }
        }
        if (!found) {
            missingFiles.push({ importPath, fullPath });
        }
    } else if (importPath.startsWith('@/')) {
        // Alias import
        const fullPath = path.resolve('c:/Projects/student-marketplace-backend-v2/src', importPath.slice(2));
        const extensions = ['.ts', '.tsx', '/index.ts', '/index.tsx', '.js', '.jsx'];
        let found = false;
        for (const ext of extensions) {
            if (fs.existsSync(fullPath + ext)) {
                found = true;
                break;
            }
        }
        if (!found) {
            missingFiles.push({ importPath, fullPath });
        }
    } else {
        // Dependency?
        // We can't easily check node_modules without a lot of logic, 
        // but we can check if it's in package.json
    }
}

console.log(JSON.stringify(missingFiles, null, 2));
