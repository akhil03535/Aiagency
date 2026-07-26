const asyncHandler = require('express-async-handler');
const { success } = require('../utils/apiResponse');
const templateService = require('../services/templateService');

const list = asyncHandler(async (req, res) => {
  const { category, businessType } = req.query;
  const templates = await templateService.listTemplates({ category, businessType });
  return success(res, { message: 'Templates fetched', data: { templates } });
});

const getOne = asyncHandler(async (req, res) => {
  const template = await templateService.getTemplate(req.params.id);
  return success(res, { message: 'Template fetched', data: { template } });
});

const listCategories = asyncHandler(async (req, res) => {
  const categories = await templateService.listCategories();
  return success(res, { message: 'Categories fetched', data: { categories } });
});

module.exports = { list, getOne, listCategories };
