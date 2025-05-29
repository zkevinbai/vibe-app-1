"use client";
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

export type PromptInputValues = {
  prompt: string;
  quality: 'low' | 'mid' | 'high';
  aspect_ratio: '1024x1024' | '1536x1024' | '1024x1536';
  n: number;
};

const promptSchema = z.object({
  prompt: z.string().min(1, 'Prompt is required'),
  quality: z.enum(['low', 'mid', 'high']),
  aspect_ratio: z.enum(['1024x1024', '1536x1024', '1024x1536']),
  n: z.number().min(1).max(4),
});

type Props = {
  onSubmit: (values: PromptInputValues) => void;
  defaultValues?: PromptInputValues;
};

const qualities = ['low', 'mid', 'high'] as const;
const aspectRatios = ['1024x1024', '1536x1024', '1024x1536'] as const;

export default function PromptInput({ onSubmit, defaultValues }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<PromptInputValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: defaultValues || {
      prompt: '',
      quality: 'mid',
      aspect_ratio: '1024x1024',
      n: 1,
    },
  });

  React.useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        reset();
      })}
      className="flex flex-col gap-4 p-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100 rounded shadow"
    >
      <input
        {...register('prompt')}
        className="border border-gray-300 dark:border-gray-700 rounded p-2 w-full bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        placeholder="Enter your prompt..."
      />
      {errors.prompt && <span className="text-red-500 text-xs">{errors.prompt.message}</span>}
      <div className="flex gap-2">
        <select {...register('quality')} className="border rounded p-2">
          {qualities.map((q) => (
            <option key={q} value={q}>{q}</option>
          ))}
        </select>
        <select {...register('aspect_ratio')} className="border rounded p-2">
          {aspectRatios.map((ar) => (
            <option key={ar} value={ar}>{ar}</option>
          ))}
        </select>
        <input
          type="number"
          {...register('n', { valueAsNumber: true })}
          className="border rounded p-2 w-20"
          min={1}
          max={4}
          placeholder="n"
        />
      </div>
      {errors.n && <span className="text-red-500 text-xs">{errors.n.message}</span>}
      <button type="submit" className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">Generate</button>
    </form>
  );
} 