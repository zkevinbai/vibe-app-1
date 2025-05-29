import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateImagesWithOpenAI } from './openai';

// Define a type for the mock localStorage
interface MockLocalStorage {
  getItem: ReturnType<typeof vi.fn>;
  setItem: ReturnType<typeof vi.fn>;
  clear: ReturnType<typeof vi.fn>;
}

// Define a type for the mock fetch function's resolved value
interface MockFetchResponse {
  ok: boolean;
  json: () => Promise<{ data: { b64_json: string }[] } | { error: { message: string } }>; // Refined return type
}

// Mock the global fetch and localStorage
const mockFetch = vi.fn();
const originalLocalStorage = global.localStorage;
let localStorageMock: MockLocalStorage;

// Cast only when assigning to global to satisfy TypeScript type constraints for global.fetch
// The mockFetch function itself retains the correct Vitest Mock typings.
global.fetch = mockFetch

describe('generateImagesWithOpenAI', () => {

  beforeEach(() => {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    // Assigning to global.localStorage needs casting to satisfy TypeScript
    global.localStorage = localStorageMock as unknown as Storage;
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  it('returns images on success', async () => {
    localStorageMock.getItem.mockReturnValue('test-key');
    mockFetch.mockResolvedValue({ // Use the typed mockFetch
      ok: true,
      json: async () => ({ data: [{ b64_json: 'abc123' }] }),
    } as MockFetchResponse); // Cast to MockFetchResponse

    const images = await generateImagesWithOpenAI({
      prompt: 'cat',
      quality: 'mid',
      aspect_ratio: '1024x1024',
      n: 1,
    });
    expect(images).toEqual([{ b64_json: 'abc123' }]);
  });

  it('throws error on API error', async () => {
    localStorageMock.getItem.mockReturnValue('test-key');
    mockFetch.mockResolvedValue({ // Use the typed mockFetch
      ok: false,
      json: async () => ({ error: { message: 'API error' } }),
    } as MockFetchResponse); // Cast to MockFetchResponse

    await expect(
      generateImagesWithOpenAI({
        prompt: 'cat',
        quality: 'mid',
        aspect_ratio: '1024x1024',
        n: 1,
      })
    ).rejects.toThrow('API error');
  });

  it('throws error if API key is missing', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    await expect(
      generateImagesWithOpenAI({
        prompt: 'cat',
        quality: 'mid',
        aspect_ratio: '1024x1024',
        n: 1,
      })
    ).rejects.toThrow('OpenAI API key not found in local storage.');
  });
}); 