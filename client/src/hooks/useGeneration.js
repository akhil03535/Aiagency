import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import generationService from '../services/generation.service';

/**
 * Wraps the generate/regenerate API calls with loading state and a
 * generation timer, so generator pages don't have to duplicate this logic.
 */
export function useGeneration() {
  const [result, setResult] = useState(null); // { generation, output }
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);

  const runGenerate = useCallback(async (payload) => {
    setIsGenerating(true);
    const start = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - start), 100);

    try {
      const data = await generationService.generate(payload);
      setResult(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Generation failed. Please try again.';
      toast.error(message);
      throw err;
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  }, []);

  const runRegenerate = useCallback(async (generationId) => {
    setIsGenerating(true);
    const start = Date.now();
    const timer = setInterval(() => setElapsedMs(Date.now() - start), 100);

    try {
      const data = await generationService.regenerate(generationId);
      setResult(data);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || 'Regeneration failed. Please try again.';
      toast.error(message);
      throw err;
    } finally {
      clearInterval(timer);
      setIsGenerating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setElapsedMs(0);
  }, []);

  return { result, isGenerating, elapsedMs, runGenerate, runRegenerate, reset };
}
