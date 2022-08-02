const express = require('express');
const fsUtils = require('./fs-utils');

const app = express();
const PORT = '3000';

const HTTP_OK_STATUS = 200;

app.use(express.json());

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  try {
    const talker = await fsUtils.readFile();
    if (!talker) {
      return res.status(200).json([]);
    }
    return res.status(HTTP_OK_STATUS).json(talker);
  } catch (error) {
    return res.status(500).end();
  }
});

app.listen(PORT, () => {
  console.log('Online');
});
