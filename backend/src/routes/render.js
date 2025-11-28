// src/routes/render.js
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const { generateScriptFromPrompt } = require('../llm/generateScript');
const { v4: uuidv4 } = require('uuid');

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');
const renderQueue = new Queue('renderQueue', { connection });

router.post('/submit', async (req, res) => {
  try {
    const { prompt, sceneOptions } = req.body;
    if (!prompt) return res.status(400).send({ error: 'prompt required' });

    // generate python script text (placeholder function)
    const scriptText = await generateScriptFromPrompt(prompt, sceneOptions);

    const id = uuidv4();
    const scriptsDir = path.resolve(__dirname, '..', 'scripts');
    if (!fs.existsSync(scriptsDir)) fs.mkdirSync(scriptsDir, { recursive: true });
    const scriptPath = path.join(scriptsDir, `${id}.py`);
    fs.writeFileSync(scriptPath, scriptText, 'utf8');

    // enqueue job into Redis
    await renderQueue.add('render-job', { id, scriptPath, labels: sceneOptions }, { attempts: 3 });

    res.send({ id, status: 'queued' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

router.get('/status/:id', async (req, res) => {
  const { id } = req.params;
  const renderPath = path.resolve(__dirname, '..', 'renders', `${id}.mp4`);
  const exists = fs.existsSync(renderPath);
  res.send({ id, done: exists, url: exists ? `/renders/${id}.mp4` : null });
});

module.exports = router;
