const axios = require('axios');
const crypto = require('crypto');

require('dotenv').config();

/**
 * Generate authentication headers based on method and path
 */
function generate_headers(method, pathWithQueryParam) {
  let datetime = new Date().toUTCString();
  let requestLine = `${method} ${pathWithQueryParam} HTTP/1.1`;
  let payload = [`date: ${datetime}`, requestLine].join("\n");
  let signature = crypto.createHmac('SHA256', process.env.MEKARI_API_CLIENT_SECRET).update(payload).digest('base64');

  return {
    'Content-Type': 'application/json',
    'Date': datetime,
    'Authorization': `hmac username="${process.env.MEKARI_API_CLIENT_ID}", algorithm="hmac-sha256", headers="date request-line", signature="${signature}"`
  };
}

// Set method and path for the request
let method = 'POST';
let path = '/v2/klikpajak/v1/efaktur/out';
let queryParam = '?auto_approval=false';
let headers = {
  'X-Idempotency-Key': '1234'
};
let body = {/* request body */};

const options = {
  method: method,
  url: `${process.env.MEKARI_API_BASE_URL}${path}`,
  headers: {...generate_headers(method, path + queryParam), ...headers}
}

// Initiate request
axios(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  });
