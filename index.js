const express = require('express');
const crypto = require('crypto');
const fsUtils = require('./fs-utils');
const {
  validateLogin,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
} = require('./middlewares/validation');
const authMiddleware = require('./middlewares/authMiddleware');

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

app.get('/talker/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const talker = await fsUtils.readFile();
    const talkerMatch = talker.find((t) => t.id === Number(id));
    if (!talkerMatch) {
      return res
        .status(404)
        .json({ message: 'Pessoa palestrante não encontrada' });
    }
    return res.status(200).json(talkerMatch);
  } catch (error) {
    return res.status(500).end();
  }
});

app.post('/login', validateLogin, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

app.post(
  '/talker',
  authMiddleware,
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    try {
      const talker = await fsUtils.readFile();
      const talkerExists = talker.some((t) => t.name === name);
      if (talkerExists) {
        return res.status(409).json({ message: 'Talker already exists' });
      }
      const lastTalkerId = talker.at(-1).id;
      const newTalker = { id: lastTalkerId + 1, name, age, talk };
      talker.push(newTalker);
      await fsUtils.writeFile(talker);
      return res.status(201).json(newTalker);
    } catch (error) {
      return res.status(500).end();
    }
  },
);

app.listen(PORT, () => {
  console.log('Online');
});
