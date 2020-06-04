import { abstractCache, BaseCache } from "./Cache";
import { isSupportServiceWorker, isHTTPS } from './util'

interface initConfig {

}
interface initServiceWorkerConfig extends initConfig {
    url: string; // services worker地址
    options?: RegistrationOptions; // services worker地址
}
interface createCacheFunc<T>{
    (type: string, config: initServiceWorkerConfig): abstractCache<T> | Promise<any> | undefined
}
interface abstractCacheFactory<T> {
    createCache: createCacheFunc<T> | undefined
    init: () => void;
}

export default class CacheFactory implements abstractCacheFactory<BaseCache> {
    swReg: ServiceWorkerRegistration | undefined
    init(){
    }
    createCache(type: string = 'sw', config: initConfig | initServiceWorkerConfig) {
        if (type === 'sw') {
            if (isSupportServiceWorker() && isHTTPS()) {
                const swConfig = <initServiceWorkerConfig>config
                return new Promise((resovle, reject) => {
                    navigator.serviceWorker.register(swConfig.url, swConfig.options).then((reg: ServiceWorkerRegistration) => {
                        this.swReg = reg;
                        console.log('Registration succeeded. Scope is ' + reg.scope);
                        resovle(reg)
                    }).catch((error) => {
                        // registration failed
                        console.log('Registration failed with ' + error);
                        reject(error)
                    }).finally(() => {
                        console.log('Registration complete');
                    })
                })
            } else {
                console.warn('Your browser does not support the service worker')
            }
        }
        return undefined
    }
}

