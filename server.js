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
  let url = req.body.url;
  
  if (!url.match(/\D/)) return res.json(errorResponse);
  if (!url.match(/^www\./)) url = `www.${url}`;
  
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
      console.log(result === undefined);
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
