// This file intentionally left minimal to avoid type errors
// We'll expand it as needed once the basic tests are working 

import '@testing-library/jest-dom/vitest';
import { vi, beforeEach } from 'vitest';

// Mock global fetch
global.fetch = vi.fn() as unknown as typeof fetch;

// Reset mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
}); 