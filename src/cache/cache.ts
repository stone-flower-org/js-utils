export interface ICache {
  get<T = unknown>(key: string): T | undefined;
  set<T = unknown>(key: string, value: T, tags?: string[], lifetime?: number): void;
  invalidateTags(tags: string[]): void;
  delete(key: string): void;
  clear(): void;
}
