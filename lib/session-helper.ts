// Minimal session helper
// This file replaces a previously corrupted helper and provides a tiny
// utility to avoid build-time errors. More full-featured helpers live in
// `lib/auth-helpers.ts` and `lib/auth-utils.ts`.

/**
 * noop function exported to keep this module importable during build.
 */
export function noop(): null {
  return null;
}