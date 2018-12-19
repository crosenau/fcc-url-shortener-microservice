'use strict';

window.onload = () => {
  document.addEventListener("keydown", handleKeys);
}

function handleKeys(event) {
  if (event.key === 'Enter' && document.activeElement.id === 'url-input') {
    displayShortUrl();
  } else if (document.activeElement.id === 'short-url-input') {
    updateShortUrlInput();
  }
  
}

function displayShortUrl() {
  const request = { 
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Encoding': 'UTF-8',
      'Content-Type': 'application/x-www-form-urlencoded',
      'mode': 'cors'
    },
    body: `url=${document.querySelector('#url-input').value}`
  };
  
  fetch('/api/shorturl/new/', request)
    .then(response => {
      return response.json();
    })
    .then(json => {
      const msgDisplay = document.querySelector('#message');
      const jsonDisplay = document.querySelector('#json');

          msgDisplay.innerHTML = '<p>API response: </p>'
      jsonDisplay.innerHTML = JSON.stringify(json, undefined, 2);
    })
    .catch(err => console.error(err));
}

function updateShortUrlInput() {
  const urlPrefix = '/api/shorturl/';
  const inputField = document.querySelector('#short-url-input');

  setTimeout(() => {
    if (inputField.value.indexOf(urlPrefix) !== 0 || inputField.value.indexOf(urlPrefix + '/') === 0) inputField.value = urlPrefix;
  }, 1);

}

function openShortUrl() {
  const shortUrl = document.querySelector('#short-url-input').value;
  
  if (shortUrl.length <= '/api/shorturl/'.length) {
    alert('Please enter a numeric shortened URL. (e.g. "/api/shorturl/0")');
  } else {
    window.open(shortUrl);
  }
  
}