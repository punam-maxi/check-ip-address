// index.js
const http = require('http');
const os = require('os');
const https = require('https');

const PORT = 3000;
const HOST = '0.0.0.0';

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // prefer IPv4 and skip internal addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return '127.0.0.1';
}

function getPublicIP() {
  return new Promise((resolve) => {
    // Simple free service returning plain text IP
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', () => resolve('unavailable'));
  });
}

const localIP = getLocalIP();

const server = http.createServer(async (req, res) => {
  const publicIP = await getPublicIP();
  const body = `Hello from Node.js in WSL ??
Your local (LAN) IP: ${localIP}
Your public (internet) IP: ${publicIP}
Requested URL: ${req.url}
`;
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(body);
});

server.listen(PORT, HOST, () => {
  console.log('? Server running');
  console.log(`?? Local:   http://localhost:${PORT}`);
  console.log(`?? Network: http://${localIP}:${PORT}`);
});
