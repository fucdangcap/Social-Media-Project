// ✅ RATE LIMITING: Chống spam API calls (FREE, không cần thư viện ngoài)
// Lưu trong memory, reset khi restart server (phù hợp cho dự án sinh viên)

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Dọn dẹp memory mỗi 5 phút
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

/**
 * Rate limiter đơn giản
 * @param identifier - IP hoặc userId
 * @param limit - Số requests tối đa
 * @param windowMs - Thời gian window (ms)
 * @returns true nếu vượt giới hạn
 */
export function isRateLimited(
  identifier: string,
  limit: number = 60, // Mặc định 60 requests
  windowMs: number = 60 * 1000 // Mặc định 1 phút
): boolean {
  const now = Date.now();
  const key = identifier;

  if (!store[key] || store[key].resetTime < now) {
    // Tạo mới hoặc reset
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return false;
  }

  store[key].count++;
  return store[key].count > limit;
}

/**
 * Lấy thông tin rate limit còn lại
 */
export function getRateLimitInfo(identifier: string) {
  const data = store[identifier];
  if (!data) return { remaining: Infinity, resetTime: 0 };
  
  return {
    remaining: Math.max(0, 60 - data.count),
    resetTime: data.resetTime,
  };
}
