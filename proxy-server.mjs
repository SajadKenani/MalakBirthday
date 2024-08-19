import http from 'http';
import httpProxy from 'http-proxy'; // Import the entire module as default

// Destructure the required function
const { createProxyServer } = httpProxy;

// Initialize the proxy server
const proxy = createProxyServer({});

// Create an HTTP server
const server = http.createServer((req, res) => {
  proxy.web(req, res, { target: 'http://rs-adviraq.com:3001' });
});

// Start listening on port 80 (or another port if needed)
server.listen(80, () => {
  console.log('Proxy server is running on http://localhost');
});
