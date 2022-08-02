const fs = require('fs/promises');

async function readFile() {
  return fs.readFile('./talker.json', 'utf-8').then((data) => JSON.parse(data));
}

async function writeFile(content) {
  return await fs.writeFile('./talker.json', JSON.stringify(content));
}

module.exports = { readFile, writeFile };
