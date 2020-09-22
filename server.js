const net = require('net');
const fs = require('fs');
const error = "File path invalid."

const server = net.createServer();

server.on('connection', (client) => {
  console.log('New client connected!');

  client.setEncoding('utf8'); // interpret data as text
  client.on('data', (path) => {
    fs.readFile(path, (err, data) => {
      if (!data || err) {
        client.write(error);
        console.log(error);
        process.exit();
      }
      else {
        console.log(`Sent file: ${path}`)
        client.write(data);
        process.exit();
      }
    });
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000!');
});