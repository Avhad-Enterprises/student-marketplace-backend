import NodeCache from "node-cache";

class Cache {
  private cache: NodeCache;

  constructor(ttlSeconds: number = 300) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: ttlSeconds * 0.2,
      useClones: false,
    });
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  public set<T>(key: string, value: T, ttl?: number): boolean {
    return this.cache.set<T>(key, value, ttl || 300);
  }

  public del(keyOrPrefix: string | string[]): number {
    if (typeof keyOrPrefix === 'string') {
      const keys = this.cache.keys();
      const keysToDelete = keys.filter(k => k.startsWith(keyOrPrefix));
      return this.cache.del(keysToDelete);
    }
    return this.cache.del(keyOrPrefix);
  }

  public flush(): void {
    this.cache.flushAll();
  }

  // Generate a standardized cache key
  public generateKey(prefix: string, params: any): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc: any, key: string) => {
        acc[key] = params[key];
        return acc;
      }, {});
    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }
}

const cache = new Cache(300); // Default 5 minutes
export default cache;
