export function isSupportServiceWorker() {
    return 'serviceWorker' in navigator && isNative(navigator.serviceWorker)
}

export function isSupportCache() {
    return 'Cache' in window && isNative(window.Cache)
}

export function isHTTPS() {
    return !!location.protocol.match(/https/)
}
/*
    本地函数返回如 function Cache() { [native code] }
    本地对象返回如 [object ServiceWorkerContainer]
*/
function isNative(value: any) {
    return !!String.prototype.toString.call(String(value)).match(/\[native code\]|\[object\s+\w+\]/)
}