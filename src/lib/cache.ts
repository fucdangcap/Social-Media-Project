// ✅ IN-MEMORY CACHE: Cache đơn giản cho dự án sinh viên (FREE, không cần Redis)
// Lưu trong RAM server, tự động clear khi đầy hoặc hết hạn

interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache: Map<string, CacheItem<any>> = new Map();
  private maxSize: number = 100; // Giới hạn 100 items

  /**
   * Lấy dữ liệu từ cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Check hết hạn chưa
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  /**
   * Lưu dữ liệu vào cache
   * @param key - Key để lưu
   * @param data - Dữ liệu cần cache
   * @param ttl - Time to live (giây), mặc định 5 phút
   */
  set<T>(key: string, data: T, ttl: number = 300): void {
    // Nếu cache đầy, xóa item cũ nhất
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + (ttl * 1000),
    });
  }

  /**
   * Xóa 1 key khỏi cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Xóa nhiều keys theo pattern (ví dụ: "post_*")
   */
  deletePattern(pattern: string): void {
    const regex = new RegExp(pattern.replace('*', '.*'));
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear toàn bộ cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Lấy số lượng items trong cache
   */
  size(): number {
    return this.cache.size;
  }
}

// Export singleton instance
export const cache = new SimpleCache();

// Dọn dẹp cache expired items mỗi 10 phút
setInterval(() => {
  const now = Date.now();
  for (const [key, item] of cache['cache'].entries()) {
    if (now > item.expiresAt) {
      cache.delete(key);
    }
  }
}, 10 * 60 * 1000);
