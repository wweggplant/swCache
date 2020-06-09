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

// This is a test and we want descriptions to be useful, if this
// breaks the max-length, it's ok.

/* eslint-disable max-len */

window.chai.should();


describe('Service Worker 测试', function() {
  this.timeout(5000);

  beforeEach(function(done) {
    Promise.all([
      SWTestHelper.unregisterAllRegistrations(),
      SWTestHelper.clearAllCaches()
    ])
    .then(() => {
      var iframeList = document.querySelectorAll('.js-test-iframe');
      for (var i = 0; i < iframeList.length; i++) {
        iframeList[i].parentElement.removeChild(iframeList[i]);
      }
    })
    .then(() => {
      console.log('\n\n----\n\n');
      done();
    }).catch(done);
  });

  after(function(done) {
    Promise.all([
      SWTestHelper.unregisterAllRegistrations(),
      SWTestHelper.clearAllCaches()
    ])
    .then(() => {
      var iframeList = document.querySelectorAll('.js-test-iframe');
      for (var i = 0; i < iframeList.length; i++) {
        iframeList[i].parentElement.removeChild(iframeList[i]);
      }
    })
    .then(() => done()).catch(done);
  });

  describe('基本测试 SW Tests', () => {
    it('是否支持service worker', function() {
      var isSupported = ('serviceWorker' in navigator);
      isSupported.should.equal(true);
    });

    it('sw是否已经成功register', function(done) {
      SWTestHelper.installSW('/sw/no-file-cache/no-file-rev/1/3', {})
      .then(() => {
        done();
      })
      .catch(() => {
        done(new Error('Unable to register a SW.'));
      });
    });
  });
});
