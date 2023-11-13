const express = require('express');
const router = express.Router();
const shiftsController = require('../controllers/shiftsController');

// Define routes
router.get('/', shiftsController.getAllShifts);
router.put('/', shiftsController.updateShiftStatus);

module.exports = router;
