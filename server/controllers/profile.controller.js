/**
 * User account profile (name/avatar) — distinct from BusinessProfile,
 * which holds business-specific context used during AI generation.
 */
const asyncHandler = require('express-async-handler');
const prisma = require('../config/prisma');
const { success } = require('../utils/apiResponse');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  isActive: true,
  createdAt: true,
};

const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: safeUserSelect,
  });
  return success(res, { message: 'Profile fetched', data: { user } });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatarUrl } = req.body;

  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: safeUserSelect,
  });

  return success(res, { message: 'Profile updated', data: { user } });
});

module.exports = { getProfile, updateProfile };
