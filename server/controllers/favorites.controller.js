const asyncHandler = require('express-async-handler');
const { success, created } = require('../utils/apiResponse');
const favoriteService = require('../services/favoriteService');

const list = asyncHandler(async (req, res) => {
  const favorites = await favoriteService.listFavorites(req.user.id);
  return success(res, { message: 'Favorites fetched', data: { favorites } });
});

const add = asyncHandler(async (req, res) => {
  await favoriteService.addFavorite(req.user.id, req.params.generationId);
  return created(res, { message: 'Added to favorites' });
});

const remove = asyncHandler(async (req, res) => {
  await favoriteService.removeFavorite(req.user.id, req.params.generationId);
  return success(res, { message: 'Removed from favorites' });
});

module.exports = { list, add, remove };
