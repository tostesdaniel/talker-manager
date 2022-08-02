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

app.get('/talker/search', authMiddleware, async (req, res) => {
  const { q } = req.query;
  const talker = await fsUtils.readFile();
  const talkerMatch = talker.filter((t) => t.name.includes(q));
  if (!q) {
    return res.status(200).json(talker);
  }
  if (!talkerMatch) {
    return res.status(200).json([]);
  }
  return res.status(200).json(talkerMatch);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await fsUtils.readFile();
  const talkerMatch = talker.find((t) => t.id === Number(id));
  if (!talkerMatch) {
    return res
      .status(404)
      .json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(talkerMatch);
});

app.get('/talker', async (_req, res) => {
  const talker = await fsUtils.readFile();
  if (!talker) {
    return res.status(200).json([]);
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

app.post('/login', validateLogin, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  return res.status(200).json({ token });
});

app.use(authMiddleware);

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await fsUtils.readFile();
  const talkerIndex = talker.findIndex((t) => t.id === Number(id));
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'No talker found' });
  }
  talker.splice(talkerIndex, 1);
  await fsUtils.writeFile(talker);
  return res.status(204).end();
});

app.use(validateName);
app.use(validateAge);
app.use(validateTalk);
app.use(validateWatchedAt);
app.use(validateRate);

app.post('/talker', async (req, res) => {
  const { name, age, talk } = req.body;
  const talker = await fsUtils.readFile();
  const talkerExists = talker.some((t) => t.name === name);
  if (talkerExists) {
    return res.status(409).json({ message: 'Talker already exists' });
  }
  const lastTalkerId = talker[talker.length - 1].id;
  const newTalker = { id: lastTalkerId + 1, name, age, talk };
  talker.push(newTalker);
  await fsUtils.writeFile(talker);
  return res.status(201).json(newTalker);
});

app.put('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const { name, age, talk } = req.body;
  const talker = await fsUtils.readFile();
  const talkerIndex = talker.findIndex((t) => t.id === Number(id));
  if (talkerIndex === -1) {
    return res.status(404).json({ message: 'No talker found' });
  }
  const editedTalker = { id: Number(id), name, age, talk };
  talker[talkerIndex] = { ...talker[talkerIndex].id, ...editedTalker };
  await fsUtils.writeFile(talker);
  return res.status(200).json(editedTalker);
});

app.listen(PORT, () => {
  console.log('Online');
});
