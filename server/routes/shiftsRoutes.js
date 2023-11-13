import express from 'express';

const router = express.Router();

import {
  getAllShifts,
  updateShiftStatus,
} from '../controllers/shiftsController.js';

const ROUTES = { SLASH: '/' };

router.get(ROUTES.SLASH, getAllShifts);

router.put(ROUTES.SLASH, updateShiftStatus);

export default router;
