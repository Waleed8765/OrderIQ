import { describe, expect, it } from 'vitest';
import { getApiBaseUrl, getSocketBaseUrl } from './network';

describe('network utils', () => {
  it('returns the expected default API URL', () => {
    expect(getApiBaseUrl()).toBe('http://localhost:5002/api');
  });

  it('derives socket base URL from API URL', () => {
    expect(getSocketBaseUrl()).toBe('http://localhost:5002');
  });
});

