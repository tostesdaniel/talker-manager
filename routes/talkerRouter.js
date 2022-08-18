const express = require('express');
const talkerRouter = express.Router();
const fsUtils = require('../fs-utils');
const authMiddleware = require('../middlewares/authMiddleware');
const {
  validateName,
  validateAge,
  validateTalk,
  validateWatchedAt,
  validateRate,
} = require('../middlewares/validation');

const HTTP_OK_STATUS = 200;

talkerRouter.get('/search', authMiddleware, async (req, res) => {
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

talkerRouter.get('/:id', async (req, res) => {
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

talkerRouter.get('/', async (_req, res) => {
  const talker = await fsUtils.readFile();
  if (!talker) {
    return res.status(200).json([]);
  }
  return res.status(HTTP_OK_STATUS).json(talker);
});

talkerRouter.use(authMiddleware);

talkerRouter.delete('/:id', async (req, res) => {
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

talkerRouter.use(validateName);
talkerRouter.use(validateAge);
talkerRouter.use(validateTalk);
talkerRouter.use(validateWatchedAt);
talkerRouter.use(validateRate);

talkerRouter.post('/', async (req, res) => {
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

talkerRouter.put('/:id', async (req, res) => {
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

module.exports = talkerRouter;
