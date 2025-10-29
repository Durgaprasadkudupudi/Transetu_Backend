const serverless = require('serverless-http');
const app = require('../routes/app');
const connectDB = require('../config/db');

// We lazily initialize the DB connection and serverless handler so cold starts
// perform the connection once and subsequent invocations reuse it.
let handler = null;
let connectPromise = null;

module.exports = async (req, res) => {
  try {
    if (!handler) {
      // Ensure we only attempt one concurrent connect
      if (!connectPromise) {
        connectPromise = connectDB();
      }
      await connectPromise;
      handler = serverless(app);
    }

    return handler(req, res);
  } catch (err) {
    console.error('Serverless function error:', err && err.stack ? err.stack : err);
    // If headers already sent, just end the response.
    try {
      if (!res.headersSent) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Internal Server Error');
      } else {
        res.end();
      }
    } catch (e) {
      console.error('Error sending error response:', e);
    }
  }
};
