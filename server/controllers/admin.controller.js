const asyncHandler = require('express-async-handler');
const { success, created } = require('../utils/apiResponse');
const adminService = require('../services/adminService');

const getDashboard = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();
  return success(res, { message: 'Dashboard stats fetched', data: stats });
});

const listUsers = asyncHandler(async (req, res) => {
  const { search, role, page, limit } = req.query;
  const result = await adminService.listUsers({ search, role, page, limit });
  return success(res, {
    message: 'Users fetched',
    data: { users: result.users },
    meta: result.pagination,
  });
});

const setUserActiveStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const user = await adminService.setUserActiveStatus(
    req.user.id,
    req.params.id,
    Boolean(isActive)
  );
  return success(res, { message: 'User status updated', data: { user } });
});

const setUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await adminService.setUserRole(req.user.id, req.params.id, role);
  return success(res, { message: 'User role updated', data: { user } });
});

const listActivityLogs = asyncHandler(async (req, res) => {
  const { action, page, limit } = req.query;
  const result = await adminService.listActivityLogs({ action, page, limit });
  return success(res, {
    message: 'Activity logs fetched',
    data: { logs: result.logs },
    meta: result.pagination,
  });
});

const createTemplate = asyncHandler(async (req, res) => {
  const template = await adminService.createTemplate(req.body);
  return created(res, { message: 'Template created', data: { template } });
});

const updateTemplate = asyncHandler(async (req, res) => {
  const template = await adminService.updateTemplate(req.params.id, req.body);
  return success(res, { message: 'Template updated', data: { template } });
});

const deleteTemplate = asyncHandler(async (req, res) => {
  await adminService.deleteTemplate(req.params.id);
  return success(res, { message: 'Template deactivated' });
});

module.exports = {
  getDashboard,
  listUsers,
  setUserActiveStatus,
  setUserRole,
  listActivityLogs,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
