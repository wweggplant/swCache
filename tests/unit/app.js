/**
 * Copyright 2015 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var pkg = require('../../package.json');
var app = express();

const distName = `${pkg.name}.${pkg .version}`
// This is a template for a service worker with a place holder to add
// a files array
var serviceWorkerTemplate = fs.readFileSync('./sw-tmpl.js').toString();

// Set up static assets
app.use('/', express.static('./data/'));
app.use('/', express.static('./front-end/'));
app.use('/tests/', express.static('./tests/'));

/**
  后端生成service worker返回的内容
 */
app.get('/sw/:fileCache/:fileRev/:cacheId/:numOfAssets*', function(req, res) {
  var fileCacheString = 'no-cache';
  if (req.params.fileCache === 'file-cache') {
    fileCacheString = 'cache';
  }

  var fileEnd = '';
  if (req.params.fileRev === 'file-rev') {
    fileEnd = '.' + new Date().getTime().toString();
  }

  var fileList = [];
  for (var i = 0; i < req.params.numOfAssets; i++) {
    fileList.push('/timestamp/' + fileCacheString + '/' + i + fileEnd);
  }

  var filtered = serviceWorkerTemplate.replace('/**@@SW_ASSETLIST@@**/',
    JSON.stringify(fileList));

  filtered = filtered.replace('/**@@SW_CACHED_ID@@**/',req.params.cacheId);
  filtered = filtered.replace('/**@@SW_CONTENT@@**/', fs.readFileSync(`./front-end/build/${distName}.js`).toString());

  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  res.send(filtered);
});

// This is a help endpoint to make tests a little easier to follow behaviour
app.get('/example/file/:action/*', function(req, res) {
  res.send(req.params.action + '-' + new Date().getTime().toString());
});

// This returns a timestamp with no cache headers
app.get('/timestamp/no-cache/*', function(req, res) {
  res.send(new Date().getTime().toString());
});

// This returns a timestamp with cache headers for a year
app.get('/timestamp/cache/*', function(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=31557600');
  res.send(new Date().getTime().toString());
});

// This endpoint echos the text after echo/
app.get('/echo/:toEcho', function(req, res) {
  res.send(req.params.toEcho);
});

app.get('/test-iframe*', function(req, res) {
  res.sendFile(path.join(__dirname, 'front-end/test-iframe.html'));
});

var server = app.listen(3851, function() {
  console.log('Example app listening at http://localhost:%s',
    server.address().port);
});
