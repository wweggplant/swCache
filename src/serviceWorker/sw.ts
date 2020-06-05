import { BaseCache } from "../Cache";
import { isSupportCache } from '../util'
declare var self: ServiceWorkerGlobalScope;

export class ServiceCache extends BaseCache {
    add(name: string, value: any) {
        return caches.open(this.cacheKey).then((cache: Cache) => cache.put(name, value).then(() => this))
    }
    addRequest(request: RequestInfo) {
        return caches.open(this.cacheKey).then((cache: Cache) => cache.add(request).then(() => this))
    }
    remove(request: RequestInfo): Promise<BaseCache> {
        return caches.open(this.cacheKey).then((cache: Cache) => 
            cache.delete(request).then(() => this)
        )
    }
    get(name: string): Promise<Response | null>  {
        return caches.open(this.cacheKey).then((cache: Cache) =>
            cache.match(name).then(resp => resp ? resp : null)
        )
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
        self.addEventListener('activate', (event: any) => {
            const currentCaches = [this.cacheKey];
            event.waitUntil(
                caches.keys().then(cacheNames => {
                    return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
                }).then(cachesToDelete => {
                    return Promise.all(cachesToDelete.map(cacheToDelete => {
                        return caches.delete(cacheToDelete);
                    }));
                }).then(() => self.clients.claim())
            );
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
