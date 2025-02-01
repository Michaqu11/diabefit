const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');
const crypto = require('crypto');


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


function generateSHA256Digest(userId) {
  return crypto.createHash('sha256').update(userId, 'utf8').digest('hex');
}

const validateConnection = async (libreAPI) => {

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'version': '4.12.0',
    'product': 'llu.android',
    'Cache-Control': 'no-cache',
  };

  const body = {
    "email": libreAPI.email,
    "password": libreAPI.password,
  }

  const axiosConfig = {
    headers,
  };

  try {
    return await axios.post('https://api-eu.libreview.io/llu/auth/login', body, axiosConfig);
  } catch (error) {
    return 'Error'
  }
}

router.post('/libreData', async (req, res) => {
  const { id, libreAPI, token } = req.body;

  if (!id || !libreAPI || !token) {
    return res.status(400).json({ error: `Missing uid or libreAPI or token` });
  }

  const response = await validateConnection(libreAPI);

  if(response == "Error" || response.data.status != 0){ 
    return res.status(400).json({ error: 'Error with authorization. Please validate your email and password.' });
  }

  const _data = response.data.data;

  const _id = _data.user.id;
  const _token = _data.authTicket.token;
  const _userId = await generateSHA256Digest(_id);

  const libreData = {
    "userId": _userId,
    "token": _token,
    "email": libreAPI.email,
    "password": libreAPI.password,
  }

  const { data } = await axios.post(
    `${SERVICE_URL}/libreAPI`,
    { id, libreAPI: libreData, token },
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data.result == true ? libreData : data.result);
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

router.post('/ownProduct', async (req, res) => {
  const { id, ownProduct, token } = req.body;

  if (!id || !ownProduct || !token) {
    return res.status(400).json({ error: `Missing uid or ownProduct or token` });
  }

  const { data } = await axios.post(
    `${SERVICE_URL}/ownProduct`,
    { id, ownProduct, token },
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data);
});


router.get('/ownProduct', async (req, res) => {
  const { id, token } = req.query;

  if (!id || !token) {
    return res.status(400).json({ error: `Missing uid  or token` });
  }

  const { data } = await axios.get(
    `${SERVICE_URL}/ownProduct?id=${id}&token=${token}`,
    {
      headers: {
        "Content-Type": "application/json",
      }
    },
  );

  res.json(data);
});

router.delete('/ownProduct', async (req, res) => {
  const { id, displayName, token } = req.query;

  if (!id || !token) {
    return res.status(400).json({ error: `Missing uid  or token` });
  }

  const { data } = await axios.delete(
    `${SERVICE_URL}/ownProduct?id=${id}&displayName=${displayName}&token=${token}`,
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

router.post('/glucose', async (req, res) => {
  const {libreAPI } = req.body;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'version': '4.12.0',
    'product': 'llu.android',
    'Account-Id': `${libreAPI.userId}`,
    'authorization': `Bearer ${libreAPI.token}`,
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
