import { useEffect, useRef, useState, useCallback } from 'react';

interface MarkdownWorkerResult {
  content: string;
  id: string;
}

interface UseMarkdownWorkerReturn {
  processMarkdown: (content: string, id: string) => void;
  processMultiple: (files: Array<{ content: string; id: string }>) => void;
  results: MarkdownWorkerResult[];
  isLoading: boolean;
  error: string | null;
}

export const useMarkdownWorker = (): UseMarkdownWorkerReturn => {
  const workerRef = useRef<Worker | null>(null);
  const [results, setResults] = useState<MarkdownWorkerResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create worker only if supported
    if (typeof Worker !== 'undefined') {
      workerRef.current = new Worker(
        new URL('../utils/markdownWorker.ts', import.meta.url),
        { type: 'module' }
      );

      workerRef.current.onmessage = (event) => {
        const { type, data } = event.data;

        switch (type) {
          case 'markdown-processed':
            setResults(prev => [
              ...prev.filter(r => r.id !== data.id),
              { content: data.content, id: data.id }
            ]);
            setIsLoading(false);
            break;

          case 'multiple-processed':
            setResults(data.files.map((file: any) => ({
              content: file.processedContent,
              id: file.id
            })));
            setIsLoading(false);
            break;

          case 'error':
            setError(data.error);
            setIsLoading(false);
            break;
        }
      };

      workerRef.current.onerror = (event) => {
        setError('Worker error occurred');
        setIsLoading(false);
      };
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const processMarkdown = useCallback((content: string, id: string) => {
    if (!workerRef.current) {
      // Fallback to synchronous processing if workers not supported
      setError('Web Workers not supported, falling back to synchronous processing');
      return;
    }

    setIsLoading(true);
    setError(null);
    workerRef.current.postMessage({
      type: 'process-markdown',
      data: { content, id }
    });
  }, []);

  const processMultiple = useCallback((files: Array<{ content: string; id: string }>) => {
    if (!workerRef.current) {
      setError('Web Workers not supported, falling back to synchronous processing');
      return;
    }

    setIsLoading(true);
    setError(null);
    workerRef.current.postMessage({
      type: 'process-multiple',
      data: { files }
    });
  }, []);

  return {
    processMarkdown,
    processMultiple,
    results,
    isLoading,
    error
  };
}; 