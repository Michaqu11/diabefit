const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');


const app = express();
app.use(cors());
app.use(express.json())

const router = express.Router();

const SERVICE_URL = "https://diabefit.pythonanywhere.com";

router.get('/', (req, res) => {
  res.send('App is running..');
});

router.post('/login', async (req, res) => {
  const { id, token } = req.body;

  if (!id || !token) {
    return res.status(400).json({ error: `Missing uid or token` });
  }

  const { data } = await axios.post(
    `${SERVICE_URL}/login`,
    { id, token },
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data);
});

router.post('/libreToken', async (req, res) => {
  const { id, libreAPI, token } = req.body;

  if (!id || !libreAPI || !token) {
    return res.status(400).json({ error: `Missing uid or libreAPI or token` });
  }

  const { data } = await axios.post(
    `${SERVICE_URL}/libreAPI`,
    { id, libreAPI, token },
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data);
});

router.post('/saveSettings', async (req, res) => {
  const { id, settings, token } = req.body;

  if (!id || !settings || !token) {
    return res.status(400).json({ error: `Missing uid or settings or token` });
  }

  const { data } = await axios.post(
    `${SERVICE_URL}/settings`,
    { id, settings, token },
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data);
});


router.post('/food', async (req, res) => {
  const { foodName, pageNumber } = req.body;

  const { data } = await axios.post(
    `${SERVICE_URL}/search?name=${foodName}&page=${pageNumber}`,
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data);
});

router.get('/glucose', async (req, res) => {
  const token = req.query.token;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'version': '4.7.0',
    'product': 'llu.android',
    'authorization': `Bearer ${token}`,
  };

  const axiosConfig = {
    headers,
  };

  try {
    const response = await axios.get('https://api-eu.libreview.io/llu/connections', axiosConfig);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);
