/**
 * History service. History rows are soft-deletable (isDeleted flag) so a
 * user's activity trail survives even after they "delete" an item from
 * their view — useful for future admin analytics.
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
  aiModel: true,
  generationTimeMs: true,
  status: true,
  createdAt: true,
  inputPayload: true,
};

async function listHistory(userId, { search, contentType, page = 1, limit = 20 }) {
  const where = {
    userId,
    isDeleted: false,
    generation: {
      ...(contentType ? { contentType } : {}),
      ...(search
        ? {
            OR: [
              { topic: { contains: search, mode: 'insensitive' } },
              { outputContent: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    },
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    prisma.history.findMany({
      where,
      include: { generation: { select: GENERATION_SELECT } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.history.count({ where }),
  ]);

  // Attach isFavorited flag by checking the Favorite table in one query.
  const generationIds = items.map((h) => h.generation.id);
  const favorites = generationIds.length
    ? await prisma.favorite.findMany({
        where: { userId, generationId: { in: generationIds } },
        select: { generationId: true },
      })
    : [];
  const favoritedSet = new Set(favorites.map((f) => f.generationId));

  return {
    items: items.map((h) => ({
      historyId: h.id,
      createdAt: h.createdAt,
      isFavorited: favoritedSet.has(h.generation.id),
      ...h.generation,
    })),
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

async function deleteHistoryItem(userId, historyId) {
  const item = await prisma.history.findFirst({ where: { id: historyId, userId } });
  if (!item) {
    throw new AppError('History item not found.', 404);
  }
  await prisma.history.update({ where: { id: historyId }, data: { isDeleted: true } });
}

async function getReusableInput(userId, generationId) {
  const generation = await prisma.generation.findFirst({
    where: { id: generationId, userId },
    select: { contentType: true, inputPayload: true },
  });
  if (!generation) {
    throw new AppError('Generation not found.', 404);
  }
  return generation;
}

module.exports = { listHistory, deleteHistoryItem, getReusableInput };
