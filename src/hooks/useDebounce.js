import { useState, useEffect } from 'react';

/**
 * useDebounce — returns a debounced copy of `value`.
 * The returned value only updates after `delay` ms of inactivity.
 *
 * @param {*}      value  - The value to debounce (string, object, etc.)
 * @param {number} delay  - Debounce delay in milliseconds (default: 800)
 * @returns {*} debouncedValue
 */
export function useDebounce(value, delay = 800) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
