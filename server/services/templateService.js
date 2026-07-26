/**
 * Templates service. Templates are seeded (see prisma/seed.js) and
 * primarily read-only for regular users — they exist to prefill
 * sensible defaults on the generator form for a given business type.
 * Full CRUD management is exposed to admins only (see adminService.js).
 */
const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

async function listTemplates({ category, businessType }) {
  return prisma.template.findMany({
    where: {
      isActive: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(businessType ? { businessType } : {}),
    },
    include: { category: { select: { name: true, slug: true, icon: true } } },
    orderBy: { name: 'asc' },
  });
}

async function getTemplate(id) {
  const template = await prisma.template.findUnique({
    where: { id },
    include: { category: { select: { name: true, slug: true, icon: true } } },
  });
  if (!template || !template.isActive) {
    throw new AppError('Template not found.', 404);
  }
  return template;
}

async function listCategories() {
  return prisma.category.findMany({ orderBy: { order: 'asc' } });
}

module.exports = { listTemplates, getTemplate, listCategories };
