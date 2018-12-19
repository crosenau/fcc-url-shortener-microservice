'use strict';

const mongodb = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true } );

const Schema = mongoose.Schema;
const urlMapSchema = new Schema ({
  original_url: String,
  short_url: Number
});

const UrlMap = mongoose.model('url', urlMapSchema);

async function getShortUrl(url) {
  try {
    const queryResult = await searchByUrl(url);
    
    if (queryResult) return queryResult;
    
    const newShortUrl = await getNextShortUrl();
    const newUrlMap = await saveUrlMap(url, newShortUrl);
    return newUrlMap;
  } catch(err) {
    console.error(err);
  }  
}

async function getOriginalUrl(shortUrl) {
  try {
    const queryResult = await searchByShortUrl(shortUrl);
    return queryResult.original_url;
  } catch(err) {
    console.error(err);
  }
}

function searchByUrl(normalUrl) {
  return new Promise((resolve, reject) => {
    UrlMap.findOne({ original_url: normalUrl })
      .select('original_url short_url -_id')    
      .exec(function(err, result) {
        if (err) reject(err);
        resolve(result);
      });
  });
}

function searchByShortUrl(shortUrl) {
  return new Promise((resolve, reject) => {
    UrlMap.findOne({ short_url: shortUrl })
      .select('original_url -_id')
      .exec(function(err, result) {
        if(err) reject(err);
        resolve(result);
    });
  });
}

function getNextShortUrl() {
  // Find maximum short url value and return that + 1
  
  return new Promise((resolve, reject) => {
    UrlMap.findOne({ original_url: /\w/ })
      .sort({ short_url: -1 })
      .select('short_url -_id')
      .exec(function(err, shortUrl) {
        if (err) {
          reject(err);
        } else if (shortUrl) {
          resolve(shortUrl.short_url + 1);
        } else {
          resolve(0);
        }
    });
  });
}

function saveUrlMap(originalUrl, shortUrl) {
  return new Promise((resolve, reject) => {
    const urlMapObj = {
      original_url: originalUrl,
      short_url: shortUrl
    };
    const newUrlMap = new UrlMap(urlMapObj);    
    
    newUrlMap.save(function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(urlMapObj);
      }
    });
  });
}

function deleteAllUrlMaps() {
  UrlMap.deleteMany({ original_url: /\w/}, function(err, data) {
    if (err) {
      console.error(err);
    } else {
      console.log('Deleting all UrlMaps');
      console.log(data);
    }   
  
  })
}

exports.getShortUrl = getShortUrl;
exports.getOriginalUrl = getOriginalUrl;