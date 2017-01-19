'use strict';

const fs = require('fs');
const request = require('request');
const handleErr = require('../utils').handleErr;


function cat (stdin, filenames, done) {
  if (stdin && !filenames) return done(stdin); 
  filenames = filenames.split(' ');
  const texts = []; 
  var count = 0;
  filenames.forEach(function (filename, i) {
    fs.readFile(filename, { encoding: 'utf8' }, function (err, text) {
      if (err) handleErr(err);
      if (!text) text = '';
      texts[i] = text;
      count++;
      if (count === filenames.length) done(texts.join('')); // like Unix: no newline. Dangerous!
    });
  });
}

// commands that work on a single file:

// This helps to DRY up the following five functions
function processFile (stdin, filename, done, custom) {
  if (stdin && !filename) produceOutput(null, stdin);
  else fs.readFile(filename, {encoding: 'utf8'}, produceOutput);
  function produceOutput (err, text) {
    if (err) handleErr(err);
    if (!text) text = '';
    done(custom(String(text)));
  }
}

function head (stdin, filename, done) {
  processFile(stdin, filename, done, function custom (text) {
    return text.split('\n').slice(0, 5).join('\n');
  });
}

function tail (stdin, filename, done) {
  processFile(stdin, filename, done, function custom (text) {
    return text.split('\n').slice(-5).join('\n');
  });
}

function sort (stdin, filename, done) {
  processFile(stdin, filename, done, function custom (text) {
    return text.split('\n').sort().join('\n');
  });
}

function wc (stdin, filename, done) {
  processFile(stdin, filename, done, function custom (text) {
    return text.split('\n').length;
  });
}

function uniq (stdin, filename, done) {
  processFile(stdin, filename, done, function custom (text) {
    const lines = text.split('\n');
    for (var i = 0; i < lines.length - 1; i++) {
      if (lines[i] === lines[i + 1]) {
        lines.splice(i, 1);
        i--; // have to check this line for duplicates again
      }
    }
    return lines.join('\n');
  });
}


function curl (stdin, url, done) {
  if (stdin && !url) return produceOutput(null, {statusCode: 200}, stdin);
  // curl does an HTTP GET request and outputs the response body
  if (url.slice(0, 7) !== 'http://') url = 'http://' + url;
  request(url, produceOutput);
  function produceOutput (err, response, body) {
    if (err) handleErr(err);
    else if (response && (response.statusCode > 400)) handleErr(response.statusCode);
    if (body) done(body);
    else done('');
  }
}

module.exports = {
  cat: cat,
  head: head,
  tail: tail,
  sort: sort,
  wc: wc,
  uniq: uniq,
  curl: curl
};
