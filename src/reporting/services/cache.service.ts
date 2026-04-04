import crypto from "crypto";

interface CacheEntry {
    value: any;
    expiresAt: number;
}

const store = new Map<string, CacheEntry>();

export class CacheService {
    static key(config: object): string {
        return crypto
            .createHash("md5")
            .update(JSON.stringify(config))
            .digest("hex");
    }

    static get(key: string): any | null {
        const entry = store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            store.delete(key);
            return null;
        }
        return entry.value;
    }

    static set(key: string, value: any, ttlSeconds = 60): void {
        store.set(key, {
            value,
            expiresAt: Date.now() + ttlSeconds * 1000,
        });
    }

    static invalidate(key: string): void {
        store.delete(key);
    }

    static invalidateAll(): void {
        store.clear();
    }
}