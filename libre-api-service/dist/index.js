const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
const port = 3000; // Choose the desired port

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Content-Type', 'application/json');
  res.header('Accept', '*/*');
  res.header('version', '4.7.0');
  res.header('product', 'llu.android');
  next();
});

app.get('/libreConnection', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});