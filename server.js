'use strict';

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const database = require('./database.js');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.post('/api/shorturl/new', (req, res) => {
  const errorResponse = { error: "invalid URL" };
  
  if (!req.body.url.match(/\D/)) return res.json(errorResponse);
  
  // Validate input URL
  dns.lookup(req.body.url, (err, address, family) => {
    if (err) {
      console.error(err);
      return res.json(errorResponse);
    }
    
    res.json({
      original_url: req.body.url,
      short_url: 1
    });
    
    database.testMongo();
    
  });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
