const express = require('express');
const crypto = require('crypto');
const talkerRouter = require('./routes/talkerRouter');
const { validateLogin } = require('./middlewares/validation');

const app = express();
const PORT = '3000';

const HTTP_OK_STATUS = 200;

app.use(express.json());

app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.use('/talker', talkerRouter);

app.post('/login', validateLogin, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});
