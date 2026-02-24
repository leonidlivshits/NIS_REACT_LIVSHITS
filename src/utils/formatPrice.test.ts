import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('should format price in USD by default', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('should format price in EUR', () => {
    expect(formatPrice(100, 'EUR')).toBe('€100.00');
  });

  it('should handle zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });
});
