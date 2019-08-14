export const asyncLocalStorage = {
  async setItem(key: string, value: string) {
    return localStorage.setItem(`geojson.geolonia.com__${key}`, value);
  },
  async getItem(key: string): Promise<string | null> {
    const result = localStorage.getItem(`geojson.geolonia.com__${key}`);
    return result;
  }
};
