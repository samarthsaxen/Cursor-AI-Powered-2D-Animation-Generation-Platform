// src/index.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const renderRoute = require('./routes/render');

const app = express();
app.use(express.json());

// serve generated videos
app.use('/renders', express.static(path.join(__dirname, '..', 'renders')));

app.use('/api/render', renderRoute);

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('Backend listening on', port));
