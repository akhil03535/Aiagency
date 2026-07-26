/**
 * Business Profile service. A user can have multiple profiles (e.g. running
 * two businesses), but exactly one is flagged isDefault=true and that's the
 * one auto-applied during AI generation (used starting Phase 4).
 */
const prisma = require('../config/prisma');
const { AppError } = require('../middleware/errorHandler');

const ALLOWED_FIELDS = [
  'businessName',
  'businessType',
  'website',
  'phone',
  'location',
  'audience',
  'brandTone',
  'products',
  'services',
  'socialLinks',
  'logoUrl',
  'description',
];

function pickAllowedFields(payload) {
  return ALLOWED_FIELDS.reduce((acc, key) => {
    if (payload[key] !== undefined) acc[key] = payload[key];
    return acc;
  }, {});
}

async function listProfiles(userId) {
  return prisma.businessProfile.findMany({
    where: { userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'asc' }],
  });
}

async function getProfile(userId, profileId) {
  const profile = await prisma.businessProfile.findFirst({
    where: { id: profileId, userId },
  });
  if (!profile) {
    throw new AppError('Business profile not found.', 404);
  }
  return profile;
}

async function createProfile(userId, payload) {
  const data = pickAllowedFields(payload);
  const existingCount = await prisma.businessProfile.count({ where: { userId } });

  // The very first profile a user creates is automatically their default.
  const isDefault = existingCount === 0;

  return prisma.businessProfile.create({
    data: { ...data, userId, isDefault },
  });
}

async function updateProfile(userId, profileId, payload) {
  await getProfile(userId, profileId); // throws 404 if not found / not owned
  const data = pickAllowedFields(payload);

  return prisma.businessProfile.update({
    where: { id: profileId },
    data,
  });
}

async function deleteProfile(userId, profileId) {
  const profile = await getProfile(userId, profileId);

  await prisma.businessProfile.delete({ where: { id: profileId } });

  // If the deleted profile was the default and other profiles remain,
  // promote the oldest remaining one to default so there's always one.
  if (profile.isDefault) {
    const next = await prisma.businessProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
    if (next) {
      await prisma.businessProfile.update({
        where: { id: next.id },
        data: { isDefault: true },
      });
    }
  }
}

async function setDefaultProfile(userId, profileId) {
  await getProfile(userId, profileId); // ownership check

  await prisma.$transaction([
    prisma.businessProfile.updateMany({
      where: { userId },
      data: { isDefault: false },
    }),
    prisma.businessProfile.update({
      where: { id: profileId },
      data: { isDefault: true },
    }),
  ]);

  return getProfile(userId, profileId);
}

module.exports = {
  listProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
  setDefaultProfile,
};
