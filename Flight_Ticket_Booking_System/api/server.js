// ESM Version
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export default async (req, res) => {
  try {
    // Try dynamic import of the generated SSR app
    const { reqHandler } = await import('../dist/flight_ticket_booking_system/server/main.js');
    // Handle the request using the Express app
    await reqHandler(req, res);
  } catch (error) {
    console.error('Error handling request:', error);

    // Get the directory of the current module
    const __dirname = dirname(fileURLToPath(import.meta.url));

    // Fallback to serving the static index.html if SSR fails
    const indexPath = join(__dirname, '../dist/flight_ticket_booking_system/browser/index.html');

    try {
      const fs = require('fs');
      const indexHtml = fs.readFileSync(indexPath, 'utf8');
      res.status(200).send(indexHtml);
    } catch (fsError) {
      console.error('Error serving fallback index.html:', fsError);
      res.status(500).send('Server error');
    }
  }
};