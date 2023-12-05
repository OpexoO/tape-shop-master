export default class LocalStorageService {
  public static get<T>(key: string): T | null {
    try {
      const item: string | null = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item);
      }
      return null;
    } catch {
      return null;
    }
  }

  public static set<T>(key: string, value: T) {
    if (value == null) {
      this.delete(key);
      return;
    }

    const valueToSet = this.getCompatibleValueToSet<T>(value);
    localStorage.setItem(key, JSON.stringify(valueToSet));
  }

  public static delete(key: string) {
    localStorage.removeItem(key);
  }

  public static clear(): void {
    localStorage.clear();
  }

  private static getCompatibleValueToSet<T>(value: T): T[] | T {
    if (Array.isArray(value)) {
      return [...value];
    }
    if (typeof value === 'object') {
      return { ...value };
    }
    return value;
  }
}
