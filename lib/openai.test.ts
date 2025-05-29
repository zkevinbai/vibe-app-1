import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateImagesWithOpenAI } from './openai';

global.fetch = vi.fn();

describe('generateImagesWithOpenAI', () => {
  const originalLocalStorage = global.localStorage;
  let localStorageMock: any;

  beforeEach(() => {
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn(),
    };
    global.localStorage = localStorageMock;
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.localStorage = originalLocalStorage;
  });

  it('returns images on success', async () => {
    localStorageMock.getItem.mockReturnValue('test-key');
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [{ b64_json: 'abc123' }] }),
    });
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
    (fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: { message: 'API error' } }),
    });
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