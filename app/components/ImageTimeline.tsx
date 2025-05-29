"use client";

import React from 'react';

export type TimelineImage = {
  b64_json: string;
  id?: string;
  prompt?: string;
  createdAt?: string;
  aspect_ratio?: string;
  jobId?: string;
  status?: string;
  dimensions?: string;
  model?: string;
  quality?: string;
};

type Props = {
  images: TimelineImage[];
  loading?: boolean;
  emptyMessage?: string;
  onDownload?: (img: TimelineImage) => void;
};

function downloadImage(b64: string, filename = 'image.webp') {
  const link = document.createElement('a');
  link.href = `data:image/webp;base64,${b64}`;
  link.download = filename;
  link.click();
}

export default function ImageTimeline({ images, loading, emptyMessage, onDownload }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
        <div className="text-blue-600">Loading images...</div>
      </div>
    );
  }
  if (!images.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white dark:bg-gray-900">
        <span className="text-2xl mb-2">🖼️</span>
        <span>{emptyMessage || 'No images yet. Try generating something!'}</span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      {images.map((img, idx) => (
        <div
          key={img.id || idx}
          className="aspect-square bg-gray-100 dark:bg-gray-800 rounded flex items-center justify-center overflow-hidden cursor-pointer hover:shadow-lg"
          title={img.prompt || ''}
          onClick={() => {
            downloadImage(img.b64_json, `image-${img.id || idx}.webp`);
            if (onDownload) onDownload(img);
          }}
        >
          <img
            src={`data:image/webp;base64,${img.b64_json}`}
            alt={img.prompt || `Generated image ${idx + 1}`}
            className="object-contain w-full h-full"
          />
        </div>
      ))}
    </div>
  );
} 