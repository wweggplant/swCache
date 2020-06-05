export interface abstractCache<abstractCache> {
    add: (name: string, value: any) => Promise<abstractCache>,
    remove: (name: string) => Promise<abstractCache>,
    get: (name: string) => Promise<Response | null>
    init: () => void
}
export abstract class BaseCache implements abstractCache<BaseCache> {
    init(){}
    abstract add(name: string, value: any): Promise<BaseCache>
    abstract remove(name: string): Promise<BaseCache>
    abstract get(name: string): Promise<Response | null>
}
/* export class ClientSwCache extends BaseCache {
    constructor() {
        super();
    }
    add(name: string, value: any) {
        return Promise.resolve(this);
    }
    remove(name: string) {
        return Promise.resolve(this);
    }
    get(name: string) {}
}
 */