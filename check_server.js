const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'HEAD',
  timeout: 2000
};

const req = http.request(options, (res) => {
  console.log(`Server is running on port 3000. Status code: ${res.statusCode}`);
  process.exit(0);
});

req.on('error', (e) => {
  console.error(`Server is not running on port 3000: ${e.message}`);
  process.exit(1);
});

req.on('timeout', () => {
  console.error('Request timed out');
  req.destroy();
  process.exit(1);
});

req.end(); 