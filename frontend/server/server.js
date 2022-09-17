const path = require('path');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(publicPath));

app.get('/', async (req, res) => {
    try {
      const response = await axios.post('https://api.assemblyai.com/v2/realtime/token', // use account token to get a temp user token
        { expires_in: 3600 }, // can set a TTL timer in seconds.
        { headers: { authorization: "3bceedca94704197aa93408a30c5ff5c" } });
      const { data } = response;
      res.json(data);
    } catch (error) {
      const {response: {status, data}} = error;
      res.status(status).json(data);
    }
  });

app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.set('port', 8000);

app.listen(app.get('port'), () => {
    console.log("server is up!");
});

