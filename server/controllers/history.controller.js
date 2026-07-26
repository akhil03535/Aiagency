const asyncHandler = require('express-async-handler');
const { success } = require('../utils/apiResponse');
const historyService = require('../services/historyService');

const list = asyncHandler(async (req, res) => {
  const { search, contentType, page, limit } = req.query;
  const result = await historyService.listHistory(req.user.id, {
    search,
    contentType,
    page,
    limit,
  });
  return success(res, {
    message: 'History fetched',
    data: { items: result.items },
    meta: result.pagination,
  });
});

const remove = asyncHandler(async (req, res) => {
  await historyService.deleteHistoryItem(req.user.id, req.params.id);
  return success(res, { message: 'History item deleted' });
});

const getReusable = asyncHandler(async (req, res) => {
  const data = await historyService.getReusableInput(req.user.id, req.params.generationId);
  return success(res, { message: 'Reusable input fetched', data });
});

module.exports = { list, remove, getReusable };
