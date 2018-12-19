'use strict';

const cors = require('cors');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const database = require('./database.js');

app.use(cors({ optionSuccessStatus: 200 }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get('/', function(req, res) {
  res.sendFile(`${__dirname}/views/index.html`);
});

app.post('/api/shorturl/new', (req, res) => {
  console.log(req.body);
  const errorResponse = { error: "invalid URL" };
  const url = req.body.url
    .replace(/https:\/\//, '')
    .replace(/http:\/\//, '')
    .replace(/^www\./, '');
  
  if (!url.match(/\D/)) return res.json(errorResponse);

  // Validate url
  dns.lookup(url, (err, address, family) => {
    if (err) {
      console.error(err);
      return res.json(errorResponse);
    }
    
    database.getShortUrl(url)
      .then(result => res.json(result))
      .catch(result => console.error(result));    
  });
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  database.getOriginalUrl(req.params.shortUrl)
    .then(result => {
      if (result === undefined) {
        res.json({ error: `No URL found for shortUrl ${req.params.shortUrl}`});
      } else {
        res.redirect(`http://${result}`);
      }
    })
    .catch(result => {
      console.error(result);
    });
});

const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
