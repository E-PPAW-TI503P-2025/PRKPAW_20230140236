const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { addUserData, isAdmin } = require('../middleware/permissionMiddleware');
const { verifyToken } = require('../middleware/authMiddleware');  // ← WAJIB ADA

router.get(
  '/daily', 
  [verifyToken, addUserData, isAdmin],   // ← susunan middleware HARUS seperti ini
  reportController.getDailyReport
);

module.exports = router;
