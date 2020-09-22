const net = require('net');
const fs = require('fs');
const readline = require('readline');
const error = "File path invalid."
const srcPath = process.argv[2];
const destPath = process.argv[3];

const saveFile = (file) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  fs.readFile(destPath, (err, data) => {
    if (data === null) {
      console.log("Destination path invalid.");
      process.exit();
    }
    if (data) {
      rl.question('Overwrite? Y/N ', (answer) => {
        if (answer !== "Y" && answer !== "y") {
          console.log('File already exists.')
          process.exit();
        }
        else {
          console.log('File overwritten.');
          fs.writeFile(destPath, file, () => {
            console.log(`Overwrote ${destPath} with server's ${srcPath}.`)
          });
        }
        rl.close();
      });
    }
    else {
      fs.writeFile(destPath, file, () => {
        console.log(`Downloaded server's ${srcPath} to ${destPath}.`)
        process.exit();
      });
    }
  });
}

const getFile = () => {
  const conn = net.createConnection({ 
    host: "localhost", // change to IP address of computer or ngrok host if tunneling
    port: 3000 // or change to the ngrok port if tunneling
  });

  conn.setEncoding('utf8'); // interpret data as text
  
  conn.on('connect', () => {
    conn.write(srcPath);
  });
  
  conn.on('data', (data) => {
    if (data === error) {
      console.log("Source path invalid.")
      process.exit();
    }
    else saveFile(data);
  });
}

getFile();