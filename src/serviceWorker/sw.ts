import { BaseCache } from "../Cache";
import { isSupportCache } from '../util'
export class ServiceCache extends BaseCache {
    async add(name: string, value: any): Promise<BaseCache> {
        const cache = await caches.open(this.cacheKey)
        await cache.put(name, value)
        return this;
    }
    async addRequest(request: RequestInfo) {
        const cache = await caches.open(this.cacheKey)
        return cache.add(request);
    }
    async remove(request: RequestInfo): Promise<BaseCache> {
        const cache = await caches.open(this.cacheKey)
        await cache.delete(request)
        return this
    }
    async get(name: string): Promise<Response>  {
        const cache = await caches.open(this.cacheKey)
        const resp = await cache.match(name)
        return resp ? resp : <Response><unknown>resp
    }
    cacheKey = 'swCacheKey'
    isSupportCache: boolean = true
    constructor() {
        super();
        this.isSupportCache = isSupportCache();
        if (!this.isSupportCache) {
            console.warn('Your browser does not support the Cache')
            return
        }
        this.initEventListener()
    }
    initEventListener() {
        self.addEventListener("message", (event) => {
            // TODO sw与窗口通讯问题
            const data = event.data
            console.log(`service workers message get: ${data}`);
            if (!data.type) {
                console.warn(`data no type`);
            } else if(data.type === 'add'){
                this.add(data.name, data.value)
            } else if(data.type === 'remove'){
                this.remove(data.name)
            } else if (data.type === 'get') {
                this.get(data.name)
            }
        });
        self.addEventListener('fetch', (event: any) =>  {
            event.respondWith(caches.match(event.request).then((response) => {
                // caches.match() always resolves
                // but in case of success response will have value
                if (response !== undefined) {
                    return response;
                } else {
                    return fetch(event.request).then( (response) => {
                        // response may be used only once
                        // we need to save clone to put one copy in cache
                        // and serve second one
                        let responseClone = response.clone();
                        caches.open(this.cacheKey).then(function (cache) {
                            cache.put(event.request, responseClone);
                        });
                        return response;
                    }).catch(function () {
                        // return caches.match('/sw-test/gallery/myLittleVader.jpg');
                    });
                }
            }));
        });
    }
}
