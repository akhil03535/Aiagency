/**
 * Admin service. All functions here assume the caller has already been
 * verified as an ADMIN by the restrictTo('ADMIN') middleware — no role
 * checks happen in this file itself.
 */
const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

async function getDashboardStats() {
  const [totalUsers, totalGenerations, generationsToday, activeUsers, failedGenerations] =
    await Promise.all([
      prisma.user.count(),
      prisma.generation.count(),
      prisma.generation.count({
        where: { createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.generation.count({ where: { status: 'FAILED' } }),
    ]);

  // Generations grouped by content type — powers a simple bar chart.
  const byContentType = await prisma.generation.groupBy({
    by: ['contentType'],
    _count: { contentType: true },
    orderBy: { _count: { contentType: 'desc' } },
    take: 10,
  });

  const recentActivity = await prisma.activityLog.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { name: true, email: true } } },
  });

  return {
    totalUsers,
    totalGenerations,
    generationsToday,
    activeUsers,
    failedGenerations,
    topContentTypes: byContentType.map((row) => ({
      contentType: row.contentType,
      count: row._count.contentType,
    })),
    recentActivity,
  };
}

async function listUsers({ search, role, page = 1, limit = 20 }) {
  const where = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: { select: { generations: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

async function setUserActiveStatus(adminUserId, targetUserId, isActive) {
  if (adminUserId === targetUserId && !isActive) {
    throw new AppError('You cannot deactivate your own account.', 400);
  }

  const user = await prisma.user.update({
    where: { id: targetUserId },
    data: { isActive },
    select: { id: true, name: true, email: true, isActive: true },
  });

  return user;
}

async function setUserRole(adminUserId, targetUserId, role) {
  if (adminUserId === targetUserId && role !== 'ADMIN') {
    throw new AppError('You cannot demote your own account.', 400);
  }

  return prisma.user.update({
    where: { id: targetUserId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
}

async function listActivityLogs({ action, page = 1, limit = 50 }) {
  const where = action ? { action } : {};
  const skip = (Number(page) - 1) * Number(limit);

  const [logs, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip,
      take: Number(limit),
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
}

// --- Template management (admin can create/edit/deactivate templates) ---

async function createTemplate(payload) {
  return prisma.template.create({ data: payload });
}

async function updateTemplate(id, payload) {
  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Template not found.', 404);
  }
  return prisma.template.update({ where: { id }, data: payload });
}

async function deleteTemplate(id) {
  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Template not found.', 404);
  }
  // Soft-delete via isActive so historical Generations that reference this
  // template via templateId aren't orphaned.
  await prisma.template.update({ where: { id }, data: { isActive: false } });
}

module.exports = {
  getDashboardStats,
  listUsers,
  setUserActiveStatus,
  setUserRole,
  listActivityLogs,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
