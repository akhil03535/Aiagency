/**
 * Central router. Each feature area gets its own file under routes/.
 * All core feature routes are now live: auth, profile, business-profile,
 * generation, history, favorites, templates, and admin.
 */
const express = require('express');

const router = express.Router();

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const profileRoutes = require('./profile.routes');
const businessProfileRoutes = require('./businessProfile.routes');
const generationRoutes = require('./generation.routes');
const historyRoutes = require('./history.routes');
const favoritesRoutes = require('./favorites.routes');
const templatesRoutes = require('./templates.routes');
const adminRoutes = require('./admin.routes');

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/business-profile', businessProfileRoutes);
router.use('/generate', generationRoutes);
router.use('/history', historyRoutes);
router.use('/favorites', favoritesRoutes);
router.use('/templates', templatesRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
