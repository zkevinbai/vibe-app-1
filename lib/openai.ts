// Utility to generate images using OpenAI's gpt-image-1 model

export type GenerateImageParams = {
  prompt: string;
  quality: 'low' | 'mid' | 'medium' | 'high' | 'auto'; // Accept 'mid' in UI, map to 'medium' for API
  aspect_ratio: '1024x1024' | '1536x1024' | '1024x1536';
  output_compression?: number; // 0-100, default 50
  n?: number; // number of images
};

export type GeneratedImage = {
  b64_json: string;
  // Add more fields if needed from the API response
};

function mapQuality(quality: string) {
  if (quality === 'mid') return 'medium';
  return quality;
}

export async function generateImagesWithOpenAI({
  prompt,
  quality,
  aspect_ratio,
  output_compression = 50,
  n = 1,
}: GenerateImageParams): Promise<GeneratedImage[]> {
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    throw new Error('OpenAI API key not found in local storage.');
  }

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      model: 'gpt-image-1',
      quality: mapQuality(quality),
      size: aspect_ratio, // Use 'size' instead of 'aspect_ratio'
      output_compression,
      output_format: 'webp',
      moderation: 'low',
      n,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error?.message || 'Failed to generate image(s) with OpenAI.');
  }

  const data = await response.json();
  return data.data as GeneratedImage[];
} 