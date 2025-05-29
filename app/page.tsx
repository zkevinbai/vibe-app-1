"use client";
import React, { useState, useCallback, useEffect } from 'react';
import PromptInput, { PromptInputValues } from './components/PromptInput';
import ImageTimeline, { TimelineImage } from './components/ImageTimeline';
import { generateImagesWithOpenAI } from '../lib/openai';
import { Settings, Trash2, RefreshCw, Download } from 'lucide-react';

// PromptHistory component
function PromptHistory({ history, onSelect, onDelete }: {
  history: PromptInputValues[];
  onSelect: (values: PromptInputValues) => void;
  onDelete: (prompt: string) => void;
}) {
  if (history.length === 0) return null;
  return (
    <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded shadow p-4 mb-4">
      <div className="font-semibold mb-2">Prompt History</div>
      <ul className="space-y-2">
        {history.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <span className="truncate max-w-xs" title={item.prompt}>
              {item.prompt} <span className="text-xs text-gray-500">[{item.quality}, {item.aspect_ratio}, n={item.n}]</span>
            </span>
            <div className="flex gap-1">
              <button
                className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center gap-1"
                onClick={() => onSelect(item)}
                title="Re-run"
              >
                <RefreshCw size={14} /> Re-run
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 flex items-center gap-1"
                onClick={() => onDelete(item.prompt)}
                title="Delete prompt"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// New: SettingsModal component
function SettingsModal({ open, onClose, onSaveApiKey, onClearData, apiKey }: {
  open: boolean;
  onClose: () => void;
  onSaveApiKey: (key: string) => void;
  onClearData: () => void;
  apiKey: string;
}) {
  const [key, setKey] = useState(apiKey);
  useEffect(() => { setKey(apiKey); }, [apiKey]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded shadow p-6 w-full max-w-sm">
        <div className="font-semibold mb-2">Settings</div>
        <label className="block mb-2">OpenAI API Key</label>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          className="border rounded p-2 w-full mb-4"
        />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { onSaveApiKey(key); onClose(); }}>Save</button>
          <button className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 px-4 py-2 rounded" onClick={onClose}>Close</button>
          <button className="bg-red-500 text-white px-4 py-2 rounded ml-auto" onClick={onClearData}>Clear All Data</button>
        </div>
      </div>
    </div>
  );
}

// New: PromptDetailsModal component
function PromptDetailsModal({ open, onClose, prompt, images, onRerun, onDownloadAll }: {
  open: boolean;
  onClose: () => void;
  prompt: PromptInputValues | null;
  images: TimelineImage[];
  onRerun: () => void;
  onDownloadAll: () => void;
}) {
  if (!open || !prompt) return null;
  const meta = images[0] || {};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded shadow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <div className="font-semibold">Prompt Details</div>
          <button onClick={onClose} className="text-gray-500 hover:text-black" title="Close">✕</button>
        </div>
        <div className="mb-2"><span className="font-semibold">Prompt:</span> {prompt.prompt}</div>
        <div className="mb-2 text-xs text-gray-500">Quality: {prompt.quality}, Aspect Ratio: {prompt.aspect_ratio}, n: {prompt.n}</div>
        {/* Metadata display */}
        <div className="mb-2 text-xs grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
          <div><span className="font-semibold">jobId:</span> {meta.jobId || 'N/A'}</div>
          <div><span className="font-semibold">Created:</span> {meta.createdAt ? new Date(meta.createdAt).toLocaleString() : 'N/A'}</div>
          <div><span className="font-semibold">Status:</span> {meta.status || 'N/A'}</div>
          <div><span className="font-semibold">Image count:</span> {images.length}</div>
          <div><span className="font-semibold">Dimensions:</span> {meta.dimensions || prompt.aspect_ratio}</div>
          <div><span className="font-semibold">Model:</span> {meta.model || 'gpt-image-1'}</div>
          <div><span className="font-semibold">Quality:</span> {meta.quality || prompt.quality}</div>
        </div>
        <div className="mb-2 flex gap-2 flex-wrap">
          <button className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-1" onClick={onRerun} title="Re-run">
            <RefreshCw size={16} /> Re-run
          </button>
          <button className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-1" onClick={onDownloadAll} title="Download All">
            <Download size={16} /> Download All
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {images.map((img, idx) => (
            <img key={img.id || idx} src={`data:image/webp;base64,${img.b64_json}`} alt={prompt.prompt} className="rounded object-contain w-full h-48 bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      </div>
    </div>
  );
}

function isErrorWithMessage(e: unknown): e is { message: string } {
  return typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message?: unknown }).message === 'string';
}

export default function HomePage() {
  const [images, setImages] = useState<TimelineImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promptHistory, setPromptHistory] = useState<PromptInputValues[]>([]);
  const [formDefaults, setFormDefaults] = useState<PromptInputValues | undefined>(undefined);
  // New state for settings, filters, pagination, details
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [filterAspect, setFilterAspect] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [page, setPage] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsPrompt, setDetailsPrompt] = useState<PromptInputValues | null>(null);
  // Toast state for download feedback
  const [toast, setToast] = useState<string | null>(null);

  // Load prompt history, images, and API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('prompt_history');
    if (stored) setPromptHistory(JSON.parse(stored));
    const storedImages = localStorage.getItem('images');
    if (storedImages) setImages(JSON.parse(storedImages));
    const key = localStorage.getItem('openai_api_key');
    if (key) setApiKey(key);
  }, []);

  // Save prompt history and images to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('prompt_history', JSON.stringify(promptHistory));
  }, [promptHistory]);
  useEffect(() => {
    localStorage.setItem('images', JSON.stringify(images));
  }, [images]);

  const handlePromptSubmit = useCallback(async (values: PromptInputValues) => {
    setLoading(true);
    setError(null);
    setPromptHistory((prev) => [values, ...prev.filter(p => p.prompt !== values.prompt)]);
    try {
      const result = await generateImagesWithOpenAI({
        prompt: values.prompt,
        quality: values.quality,
        aspect_ratio: values.aspect_ratio,
        n: values.n,
      });
      setImages((prev) => [
        ...result.map((img, idx) => ({
          ...img,
          prompt: values.prompt,
          aspect_ratio: values.aspect_ratio,
          id: `${Date.now()}-${idx}`,
        })),
        ...prev,
      ]);
    } catch (e: unknown) {
      if (isErrorWithMessage(e)) {
        setError(e.message);
      } else {
        setError('Failed to generate images.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // When user clicks re-run, set form defaults and submit
  const handleHistorySelect = (values: PromptInputValues) => {
    setFormDefaults(values);
    setDetailsPrompt(values);
    setDetailsOpen(true);
  };

  // Filtering and sorting
  let filtered = images;
  if (filterAspect !== 'all') filtered = filtered.filter(img => img.aspect_ratio === filterAspect);
  filtered = [...filtered].sort((a, b) => sortOrder === 'newest' ? (b.id || '').localeCompare(a.id || '') : (a.id || '').localeCompare(b.id || ''));
  const pageSize = 12;
  const paged = filtered.slice(0, page * pageSize);
  const hasMore = filtered.length > paged.length;

  // Settings handlers
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('openai_api_key', key);
  };
  const handleClearData = () => {
    localStorage.clear();
    setPromptHistory([]);
    setImages([]);
    setApiKey('');
    setFormDefaults(undefined);
  };

  // Prompt details handlers
  const detailsImages = detailsPrompt ? images.filter(img => img.prompt === detailsPrompt.prompt) : [];
  const handleRerunPrompt = () => {
    if (detailsPrompt) handlePromptSubmit(detailsPrompt);
    setDetailsOpen(false);
  };
  const handleDownloadAll = () => {
    detailsImages.forEach((img, idx) => {
      const link = document.createElement('a');
      link.href = `data:image/webp;base64,${img.b64_json}`;
      link.download = `image-${detailsPrompt?.prompt || ''}-${idx}.webp`;
      link.click();
    });
  };

  // Toast auto-hide
  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Infinite scroll: load more images when near bottom
  React.useEffect(() => {
    if (!hasMore || loading) return;
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 300
      ) {
        setPage((p) => (hasMore ? p + 1 : p));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, loading]);

  // Delete prompt handler
  const handleDeletePrompt = (prompt: string) => {
    setPromptHistory((prev) => prev.filter(p => p.prompt !== prompt));
  };

  return (
    <main className="min-h-screen bg-gray-700 flex flex-col items-center">
      {/* Navigation bar */}
      <nav className="w-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 shadow flex items-center justify-between px-2 sm:px-6 py-3 mb-4">
        <div className="font-bold text-lg">ImgxAI</div>
        <button className="bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 px-2 sm:px-3 py-1 rounded flex items-center gap-1" onClick={() => setSettingsOpen(true)}>
          <Settings size={18} /> <span className="hidden sm:inline">Settings</span>
        </button>
      </nav>
      <div className="w-full max-w-xl">
        <PromptHistory history={promptHistory} onSelect={handleHistorySelect} onDelete={handleDeletePrompt} />
        <PromptInput onSubmit={handlePromptSubmit} key={JSON.stringify(formDefaults)} {...(formDefaults ? { defaultValues: formDefaults } : {})} />
        {loading && <div className="text-center text-blue-600 mt-2">Generating images...</div>}
        {error && <div className="text-center text-red-600 mt-2">{error}</div>}
      </div>
      <div className="w-full max-w-6xl">
        {/* Filter and sort controls */}
        <div className="flex flex-wrap gap-2 items-center mb-2 px-4">
          <label className="text-gray-900 dark:text-gray-100">Aspect Ratio:</label>
          <select value={filterAspect} onChange={e => setFilterAspect(e.target.value as '1024x1024' | '1536x1024' | '1024x1536' | 'all')} className="border border-gray-300 rounded p-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <option value="all">All</option>
            <option value="1024x1024">1024x1024</option>
            <option value="1536x1024">1536x1024</option>
            <option value="1024x1536">1024x1536</option>
          </select>
          <label className="ml-4 text-gray-900 dark:text-gray-100">Sort:</label>
          <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'newest' | 'oldest')} className="border border-gray-300 rounded p-1 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <ImageTimeline
          images={paged}
          loading={loading}
          emptyMessage="No images yet. Try generating something!"
          onDownload={() => setToast('Image downloaded!')}
        />
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded shadow z-50 animate-fade-in">
          {toast}
        </div>
      )}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} onSaveApiKey={handleSaveApiKey} onClearData={handleClearData} apiKey={apiKey} />
      <PromptDetailsModal open={detailsOpen} onClose={() => setDetailsOpen(false)} prompt={detailsPrompt} images={detailsImages} onRerun={handleRerunPrompt} onDownloadAll={handleDownloadAll} />
    </main>
  );
} 