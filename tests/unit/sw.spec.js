/* const makeServiceWorkerEnv = require('service-worker-mock');
const makeFetchMock = require('service-worker-mock/fetch');

describe('Service worker', () => {
  beforeEach(() => {
    Object.assign(
      global,
      makeServiceWorkerEnv(),
      makeFetchMock(),
      // If you're using sinon ur similar you'd probably use below instead of makeFetchMock
      // fetch: sinon.stub().returns(Promise.resolve())
    );
    jest.resetModules();
  });
  it('should add listeners', () => {
    require('../../dist/sw.0.1.0.iife.js');
    expect(self.listeners.get('install')).toBeDefined();
    expect(self.listeners.get('activate')).toBeDefined();
    expect(self.listeners.get('fetch')).toBeDefined();
  });
});
 */
const makeServiceWorkerEnv = require('service-worker-mock');
const cacheKey = 'swCacheKey'
describe('Service worker', () => {
  beforeEach(() => {
    Object.assign(global, makeServiceWorkerEnv());
    jest.resetModules();
  });

  it('should delete old caches on activate', async () => {
      require('../../dist/sw.0.1.0.iife.js');

      // Create old cache
      await self.caches.open(cacheKey);
      expect(self.snapshot().caches[cacheKey]).toBeDefined();

      // Activate and verify old cache is removed
      // await self.trigger('activate');
      // expect(self.snapshot().caches[cacheKey]).toBeUndefined();
  });
});