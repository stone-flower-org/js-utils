import { ICache } from './cache';

export class MemoryCache implements ICache {
  private _data = new Map<string, unknown>();
  private _keysByTag = new Map<string, Set<string>>();
  private _lifetimes = new Map<string, [number, number]>();

  static create() {
    return new this();
  }

  get<T = unknown>(key: string) {
    if (this._isExpired(key)) return;
    return this._data.get(key) as T | undefined;
  }

  set<T = unknown>(key: string, value: T, tags?: string[], lifetime?: number) {
    this._data.set(key, value);

    tags?.forEach((tag) => {
      this._addTag(key, tag);
    });

    if (lifetime) this._lifetimes.set(key, [this._now(), lifetime]);
  }

  invalidateTags(tags: string[]) {
    tags.forEach((tag) => {
      this._keysByTag.get(tag)?.forEach((key) => {
        this.delete(key);
      });
      this._keysByTag.delete(tag);
    });
  }

  delete(key: string) {
    this._data.delete(key);
    this._lifetimes.delete(key);
  }

  clear() {
    this._data.clear();
    this._lifetimes.clear();
    this._keysByTag.clear();
  }

  protected _addTag(key: string, tag: string) {
    let keys = this._keysByTag.get(tag);

    if (!keys) {
      keys = new Set();
      this._keysByTag.set(tag, keys);
    }

    keys.add(key);
  }

  protected _now() {
    return Date.now();
  }

  protected _isExpired(key: string) {
    const [createAt, lifetime] = this._lifetimes.get(key) ?? [];

    if (createAt && lifetime) return this._now() - createAt >= lifetime;

    return false;
  }
}
