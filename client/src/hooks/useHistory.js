import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import historyService from '../services/history.service';

export function useHistory({ search = '', contentType = '', page = 1, limit = 20 } = {}) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await historyService.list({ search, contentType, page, limit });
      setItems(result.items);
      setMeta(result.meta);
    } catch (_err) {
      toast.error('Could not load history.');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, contentType, page, limit]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const deleteItem = useCallback(
    async (historyId) => {
      await historyService.remove(historyId);
      setItems((prev) => prev.filter((item) => item.historyId !== historyId));
    },
    []
  );

  return { items, meta, isLoading, refresh, deleteItem };
}
