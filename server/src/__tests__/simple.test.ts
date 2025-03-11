/**
 * Simple test file to verify Jest is working correctly
 */

describe('Basic Tests', () => {
  it('should add two numbers correctly', () => {
    expect(1 + 1).toBe(2);
  });

  it('should concatenate strings correctly', () => {
    expect('Hello ' + 'World').toBe('Hello World');
  });

  it('should handle arrays correctly', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr).toContain(2);
  });

  it('should handle objects correctly', () => {
    const obj = { name: 'Test', value: 42 };
    expect(obj.name).toBe('Test');
    expect(obj.value).toBe(42);
  });

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success');
    expect(result).toBe('success');
  });
}); 