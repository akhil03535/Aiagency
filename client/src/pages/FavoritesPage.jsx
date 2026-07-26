import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';
import GenerationResultCard from '../components/GenerationResultCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import ComingSoonPanel from '../components/ComingSoonPanel.jsx';
import { useFavorites } from '../hooks/useFavorites.js';
import historyService from '../services/history.service';

export default function FavoritesPage() {
  const { favorites, isLoading, toggleFavorite } = useFavorites();
  const navigate = useNavigate();

  const handleReuse = async (generationId, contentType) => {
    try {
      const { inputPayload } = await historyService.getReusable(generationId);
      navigate(`/dashboard/generate/${contentType}`, { state: { prefill: inputPayload } });
    } catch (_err) {
      toast.error('Could not load this generation for reuse.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Favorites</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Your starred generations, ready to reuse.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <ComingSoonPanel
          icon={Star}
          title="No favorites yet"
          description="Star a generation from your history to pin it here for quick reuse."
        />
      ) : (
        <div className="space-y-3">
          {favorites.map((fav) => (
            <GenerationResultCard
              key={fav.favoriteId}
              generation={fav}
              isFavorited
              onToggleFavorite={() => toggleFavorite(fav.id, true)}
              onReuse={() => handleReuse(fav.id, fav.contentType)}
              showDelete={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
