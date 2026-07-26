import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import favoritesService from '../services/favorites.service';

export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await favoritesService.list();
      setFavorites(data);
    } catch (_err) {
      toast.error('Could not load favorites.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const favoritedIds = new Set(favorites.map((f) => f.id));

  const toggleFavorite = useCallback(
    async (generationId, isCurrentlyFavorited) => {
      try {
        if (isCurrentlyFavorited) {
          await favoritesService.remove(generationId);
          setFavorites((prev) => prev.filter((f) => f.id !== generationId));
          toast.success('Removed from favorites');
        } else {
          await favoritesService.add(generationId);
          toast.success('Added to favorites');
          await refresh();
        }
      } catch (_err) {
        toast.error('Could not update favorite.');
      }
    },
    [refresh]
  );

  return { favorites, favoritedIds, isLoading, refresh, toggleFavorite };
}
