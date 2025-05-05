const fs = require('fs');
require('dotenv').config(); // For local development

// Read the production template file
const prodTemplate = fs.readFileSync('./src/environments/environment.prod.template.ts', 'utf8');

// Also create a default environment file
const defaultEnv = `export const environment = {
  production: false,
  encryption: {
    secretKey: "${process.env.ENCRYPTION_SECRET_KEY || ''}",
    iv: "${process.env.ENCRYPTION_IV || ''}",
    googleClientId: "${process.env.SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID || ''}",
  },
};`;

// Get environment variables
const secretKey = process.env.ENCRYPTION_SECRET_KEY || '';
const iv = process.env.ENCRYPTION_IV || '';
const googleClientId = process.env.SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID || ''

if (!secretKey || !iv || !googleClientId) {
  console.warn('Warning: One or more encryption environment variables are not set.');
}

// Replace placeholders with environment variables
const prodOutput = prodTemplate
  .replace('${ENCRYPTION_SECRET_KEY}', secretKey)
  .replace('${ENCRYPTION_IV}', iv)
  .replace('${SPRING_SECURITY_OAUTH2_CLIENT_REGISTRATION_GOOGLE_CLIENT_ID}', googleClientId)

// Make sure the environments directory exists
if (!fs.existsSync('./src/environments')) {
  fs.mkdirSync('./src/environments', { recursive: true });
}

// Write both environment files
fs.writeFileSync('./src/environments/environment.prod.ts', prodOutput);
fs.writeFileSync('./src/environments/environment.ts', defaultEnv); // Create a default environment file

console.log('Environment files created successfully');