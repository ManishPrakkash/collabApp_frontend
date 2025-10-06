// Session helper
// Provides a small, safe client-side API for storing/reading the current
// authenticated user's id and building request headers that include
// the X-User-Id header when available.
//
// The full auth/token helpers live in `lib/auth-helpers.ts`. This file's
// goal is to be a low-risk, build-safe utility used across client code.

const USER_ID_KEY = "userId";

/**
 * Store the authenticated user id in localStorage (client only).
 * @param userId string|null - if null the key will be removed
 */
export function setStoredUserId(userId: string | null) {
  if (typeof window === "undefined") return;
  try {
    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId);
    } else {
      localStorage.removeItem(USER_ID_KEY);
    }
  } catch (err) {
    // ignore storage errors (private mode, etc.)
    // eslint-disable-next-line no-console
    console.warn("setStoredUserId failed", err);
  }
}

/**
 * Get the stored user id from localStorage (client only).
 */
export function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(USER_ID_KEY);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("getStoredUserId failed", err);
    return null;
  }
}

/**
 * Clear the stored user id (client only).
 */
export function clearStoredUserId() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(USER_ID_KEY);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("clearStoredUserId failed", err);
  }
}

/**
 * Build JSON headers and include X-User-Id when available.
 * Useful for client-side fetch calls to protected endpoints.
 */
export function buildAuthHeaders(
  existingHeaders?: Record<string, string>
): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(existingHeaders || {}),
  };

  const userId = getStoredUserId();
  if (userId && !headers["X-User-Id"] && !headers["x-user-id"]) {
    headers["X-User-Id"] = userId;
  }

  return headers;
}

export default {
  setStoredUserId,
  getStoredUserId,
  clearStoredUserId,
  buildAuthHeaders,
};