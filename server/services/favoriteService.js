/**
 * Favorites service. A favorite is a pointer to a Generation — the
 * unique(userId, generationId) constraint in the schema prevents duplicates.
 */
const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

const GENERATION_SELECT = {
  id: true,
  contentType: true,
  topic: true,
  tone: true,
  length: true,
  outputContent: true,
  hashtags: true,
  aiProvider: true,
  createdAt: true,
};

async function listFavorites(userId) {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: { generation: { select: GENERATION_SELECT } },
    orderBy: { createdAt: 'desc' },
  });

  return favorites.map((f) => ({
    favoriteId: f.id,
    favoritedAt: f.createdAt,
    ...f.generation,
  }));
}

async function addFavorite(userId, generationId) {
  const generation = await prisma.generation.findFirst({
    where: { id: generationId, userId },
  });
  if (!generation) {
    throw new AppError('Generation not found.', 404);
  }

  const existing = await prisma.favorite.findUnique({
    where: { userId_generationId: { userId, generationId } },
  });
  if (existing) {
    return existing;
  }

  return prisma.favorite.create({ data: { userId, generationId } });
}

async function removeFavorite(userId, generationId) {
  const existing = await prisma.favorite.findUnique({
    where: { userId_generationId: { userId, generationId } },
  });
  if (!existing) {
    throw new AppError('Favorite not found.', 404);
  }
  await prisma.favorite.delete({ where: { id: existing.id } });
}

module.exports = { listFavorites, addFavorite, removeFavorite };
