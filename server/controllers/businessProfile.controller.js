const asyncHandler = require('express-async-handler');
const { success, created } = require('../utils/apiResponse');
const businessProfileService = require('../services/businessProfileService');

const list = asyncHandler(async (req, res) => {
  const profiles = await businessProfileService.listProfiles(req.user.id);
  return success(res, { message: 'Business profiles fetched', data: { profiles } });
});

const getOne = asyncHandler(async (req, res) => {
  const profile = await businessProfileService.getProfile(req.user.id, req.params.id);
  return success(res, { message: 'Business profile fetched', data: { profile } });
});

const create = asyncHandler(async (req, res) => {
  const profile = await businessProfileService.createProfile(req.user.id, req.body);
  return created(res, { message: 'Business profile created', data: { profile } });
});

const update = asyncHandler(async (req, res) => {
  const profile = await businessProfileService.updateProfile(
    req.user.id,
    req.params.id,
    req.body
  );
  return success(res, { message: 'Business profile updated', data: { profile } });
});

const remove = asyncHandler(async (req, res) => {
  await businessProfileService.deleteProfile(req.user.id, req.params.id);
  return success(res, { message: 'Business profile deleted' });
});

const setDefault = asyncHandler(async (req, res) => {
  const profile = await businessProfileService.setDefaultProfile(req.user.id, req.params.id);
  return success(res, { message: 'Default business profile updated', data: { profile } });
});

module.exports = { list, getOne, create, update, remove, setDefault };
